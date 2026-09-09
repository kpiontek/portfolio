// Post-deploy check for kylepiontek.com. Cloudflare Pages publishes the site
// outside CI, so this polls the live URL until the expected build is serving,
// then asserts the security headers declared in public/_headers (read from the
// repo so the expectations live in one place) plus the endpoints that are
// easiest to break. Node builtins only.

import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MIN_HSTS_MAX_AGE = 31536000;
const VALUE_FLAGS = new Set([
  '--url',
  '--expect-asset',
  '--timeout',
  '--interval',
]);

const usage = `Usage: node scripts/verify-deploy.mjs [options]

  --url <base>           site to verify (default: https://kylepiontek.com)
  --expect-asset <path>  wait until the HTML references this build asset
  --timeout <seconds>    give up waiting after this long (default: 600)
  --interval <seconds>   delay between polls (default: 20)
  -h, --help             print this help
`;

const results = [];
const record = (name, ok, detail = '') => results.push({ name, ok, detail });

function parseArgs(argv) {
  const options = {
    url: 'https://kylepiontek.com',
    expectAsset: '',
    timeout: 600,
    interval: 20,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '-h' || flag === '--help') {
      options.help = true;
      continue;
    }
    if (!VALUE_FLAGS.has(flag)) throw new Error(`unknown flag: ${flag}`);
    const value = argv[i + 1];
    if (value === undefined) throw new Error(`${flag} needs a value`);
    i += 1;
    if (flag === '--url') options.url = value.replace(/\/+$/, '');
    if (flag === '--expect-asset') options.expectAsset = value;
    if (flag === '--timeout') options.timeout = Number(value);
    if (flag === '--interval') options.interval = Number(value);
  }
  for (const key of ['timeout', 'interval']) {
    if (!Number.isFinite(options[key]) || options[key] <= 0) {
      throw new Error(`--${key} must be a positive number of seconds`);
    }
  }
  return options;
}

// redirect: manual so a 301 or a 404 shows up as itself instead of whatever it
// points at.
const get = (url) =>
  fetch(url, {
    redirect: 'manual',
    headers: { 'cache-control': 'no-cache' },
  });

// The /* block in public/_headers is what Cloudflare should serve on every
// route, so it doubles as the expectation list.
async function readExpectedHeaders() {
  const text = await readFile(resolve(root, 'public/_headers'), 'utf8');
  const expected = new Map();
  let inBlock = false;
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    if (!/^\s/.test(line)) {
      inBlock = line.trim() === '/*';
      continue;
    }
    if (!inBlock) continue;
    const split = line.indexOf(':');
    if (split === -1) continue;
    expected.set(line.slice(0, split).trim(), line.slice(split + 1).trim());
  }
  if (expected.size === 0)
    throw new Error('no /* block found in public/_headers');
  return expected;
}

async function waitForDeploy(options) {
  const started = Date.now();
  const deadline = started + options.timeout * 1000;
  for (let attempt = 1; ; attempt += 1) {
    const elapsed = Math.round((Date.now() - started) / 1000);
    let response = null;
    let body = '';
    let note;
    try {
      response = await get(`${options.url}/`);
      body = await response.text();
      note = `status ${response.status}`;
    } catch (error) {
      note = `request failed: ${error.message}`;
    }
    const assetLive =
      !options.expectAsset || body.includes(options.expectAsset);
    if (options.expectAsset) {
      note += assetLive ? ', asset live' : ', asset not published yet';
    }
    console.log(`attempt ${attempt} (${elapsed}s): ${note}`);
    if (response?.status === 200 && assetLive) {
      record('deploy is live', true, note);
      return { response, body };
    }
    if (Date.now() + options.interval * 1000 >= deadline) {
      record(
        'deploy is live',
        false,
        `gave up after ${options.timeout}s waiting for ${options.url}/ (${note})`,
      );
      return null;
    }
    await sleep(options.interval * 1000);
  }
}

// Cloudflare's zone level HSTS setting can rewrite what _headers declares, so
// this check accepts anything at least as strong as the configured value.
function checkHsts(actual) {
  const name = 'header Strict-Transport-Security';
  if (!actual) {
    record(name, false, 'missing');
    return;
  }
  const maxAge = Number(/max-age=(\d+)/i.exec(actual)?.[1] ?? -1);
  const subdomains = /includesubdomains/i.test(actual);
  const ok = maxAge >= MIN_HSTS_MAX_AGE && subdomains;
  let detail = actual;
  if (maxAge === 0) {
    detail = `${actual} (enable HSTS under SSL/TLS, Edge Certificates, or the zone setting is overriding _headers)`;
  } else if (!ok) {
    detail = `${actual} (want max-age >= ${MIN_HSTS_MAX_AGE} and includeSubDomains)`;
  }
  record(name, ok, detail);
}

function checkHeaders(response, expected) {
  for (const [header, value] of expected) {
    if (header.toLowerCase() === 'strict-transport-security') {
      checkHsts(response.headers.get(header));
      continue;
    }
    const actual = response.headers.get(header);
    if (actual === value) record(`header ${header}`, true, 'matches _headers');
    else
      record(`header ${header}`, false, actual ? `got: ${actual}` : 'missing');
  }
}

// One wrapper so a network error reads as a failed check rather than a crash.
async function check(name, url, assert) {
  try {
    record(name, ...(await assert(await get(url))));
  } catch (error) {
    record(name, false, error.message);
  }
}

async function checkEndpoints(base) {
  await check('security.txt', `${base}/.well-known/security.txt`, async (r) => {
    const contact = (await r.text()).includes('Contact:');
    return [
      r.status === 200 && contact,
      `status ${r.status}, contact ${contact}`,
    ];
  });
  // A real 404 proves the SPA fallback is not swallowing unknown routes.
  const missing = `${base}/does-not-exist-${randomUUID().slice(0, 8)}`;
  await check('unknown route 404s', missing, (r) => [
    r.status === 404,
    `status ${r.status}`,
  ]);
  await check('resume PDF', `${base}/Kyle_Piontek_Resume.pdf`, (r) => {
    const type = r.headers.get('content-type') ?? '';
    const ok = r.status === 200 && type.toLowerCase().includes('pdf');
    return [ok, `status ${r.status}, content-type ${type || 'missing'}`];
  });
}

function printSummary() {
  const width = Math.max(...results.map((result) => result.name.length));
  console.log('\nsummary');
  for (const { name, ok, detail } of results) {
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(width)}  ${detail}`);
  }
  const failed = results.filter((result) => !result.ok).length;
  console.log(`\n${results.length - failed} passed, ${failed} failed`);
  return failed;
}

const options = parseArgs(process.argv.slice(2));
if (options.help) {
  console.log(usage);
  process.exit(0);
}

console.log(`verifying ${options.url}`);
if (options.expectAsset) console.log(`expecting asset ${options.expectAsset}`);

const live = await waitForDeploy(options);
if (live) {
  checkHeaders(live.response, await readExpectedHeaders());
  await checkEndpoints(options.url);
}
process.exit(printSummary() === 0 ? 0 : 1);
