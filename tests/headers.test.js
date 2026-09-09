// Guards the Cloudflare Pages response headers in public/_headers.
//
// Real regressions this catches:
//   - a security header quietly dropped while editing the file by hand
//   - the CSP hash drifting away from the inline Plausible bootstrap in
//     index.html, which blocks analytics in production only (vite preview
//     serves no headers, so local browsing never shows the breakage)
//   - a new external origin added to the page without a matching CSP
//     directive, which silently breaks fonts, analytics, or images on the
//     live site
//   - long-lived caching disappearing from the hashed /assets/* bundles
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (relative) => readFileSync(root + relative, 'utf8');

const headersText = read('public/_headers');
const indexHtml = read('index.html');

// dist/index.html is what Cloudflare actually serves, and vite minifies the
// inline script during the build, so the CSP hash has to be computed from the
// built file rather than the pretty-printed source.
const distIndexPath = root + 'dist/index.html';
const hasBuild = existsSync(distIndexPath);

// Origins the site is allowed to reach, and the CSP directives that must list
// each one. Anything the page references that is missing from this map fails
// the test on purpose: adding a third party should be a deliberate edit here.
const ALLOWED_ORIGINS = {
  'https://fonts.googleapis.com': ['style-src'],
  'https://fonts.gstatic.com': ['font-src'],
  'https://plausible.io': ['script-src', 'connect-src'],
};

// Where a reference found in a given place has to be allowed. `preconnect` is
// only a network hint, not a subresource load, so it has no directive of its
// own; the origin still has to appear in ALLOWED_ORIGINS above.
const CONTEXT_DIRECTIVE = {
  script: 'script-src',
  stylesheet: 'style-src',
  preconnect: null,
  image: 'img-src',
  fetch: 'connect-src',
};

/** Parses a Cloudflare `_headers` file into { pathPattern: { header: value } }. */
function parseHeadersFile(text) {
  const blocks = {};
  let current = null;

  for (const rawLine of text.split('\n')) {
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;

    if (!/^\s/.test(rawLine)) {
      current = rawLine.trim();
      blocks[current] = {};
      continue;
    }

    const line = rawLine.trim();
    const separator = line.indexOf(':');
    expect(
      separator,
      `_headers line is not "Name: value": ${line}`,
    ).toBeGreaterThan(0);
    expect(current, `_headers has a header before any path: ${line}`).not.toBe(
      null,
    );

    const name = line.slice(0, separator).trim();
    blocks[current][name] = line.slice(separator + 1).trim();
  }

  return blocks;
}

/** Splits a CSP value into { directiveName: [sourceExpression, ...] }. */
function parseCsp(value) {
  const directives = {};
  for (const part of value.split(';')) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    directives[tokens[0].toLowerCase()] = tokens.slice(1);
  }
  return directives;
}

/** Reads HTML tag attributes into a lowercase-keyed object. */
function parseAttributes(attributeText) {
  const attributes = {};
  const pattern =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let match;
  while ((match = pattern.exec(attributeText)) !== null) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}

/** Every inline, executable `<script>` body in an HTML document. */
function inlineScriptBodies(html) {
  const bodies = [];
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const attributes = parseAttributes(match[1]);
    if (attributes.src) continue;
    if ((attributes.type || '').toLowerCase() === 'application/ld+json')
      continue;
    bodies.push(match[2]);
  }
  return bodies;
}

const sha256 = (body) =>
  `sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}`;

/**
 * Every external https reference the page makes, as
 * { origin, context } pairs. Anchor hrefs are deliberately excluded: those are
 * top-level navigations, which this CSP does not restrict.
 */
function collectExternalReferences() {
  const references = [];
  const add = (url, context) => {
    if (!url || !/^https:\/\//i.test(url)) return;
    references.push({ origin: new URL(url).origin, context });
  };

  let match;

  const scriptPattern = /<script\b([^>]*)>/gi;
  while ((match = scriptPattern.exec(indexHtml)) !== null) {
    add(parseAttributes(match[1]).src, 'script');
  }

  const linkPattern = /<link\b([^>]*?)\/?>/gi;
  while ((match = linkPattern.exec(indexHtml)) !== null) {
    const attributes = parseAttributes(match[1]);
    const rel = (attributes.rel || '').toLowerCase();
    if (rel.includes('stylesheet')) add(attributes.href, 'stylesheet');
    else if (rel.includes('preconnect')) add(attributes.href, 'preconnect');
  }

  const imagePattern = /<img\b([^>]*?)\/?>/gi;
  while ((match = imagePattern.exec(indexHtml)) !== null) {
    add(parseAttributes(match[1]).src, 'image');
  }

  // Subresource requests made by the app itself.
  const jsxSources = [
    'src/Portfolio.jsx',
    'src/main.jsx',
    'src/entry-server.jsx',
  ];
  const fetchPattern =
    /(?:fetch|EventSource|WebSocket)\(\s*['"`](https:\/\/[^'"`]+)/g;
  for (const file of jsxSources) {
    const source = read(file);
    while ((match = fetchPattern.exec(source)) !== null) {
      add(match[1], 'fetch');
    }
  }

  return references;
}

const blocks = parseHeadersFile(headersText);
const globalBlock = blocks['/*'];
const assetsBlock = blocks['/assets/*'];
const csp = parseCsp(globalBlock?.['Content-Security-Policy'] ?? '');
const inlineHashes = inlineScriptBodies(indexHtml).map(sha256);

describe('public/_headers', () => {
  it('sends the security headers on every response', () => {
    expect(globalBlock, '_headers is missing a /* block').toBeTruthy();
    expect(globalBlock['Content-Security-Policy']).toBeTruthy();
    expect(globalBlock['X-Content-Type-Options']).toBe('nosniff');
    expect(globalBlock['X-Frame-Options']).toBe('DENY');
    expect(globalBlock['Referrer-Policy']).toBe(
      'strict-origin-when-cross-origin',
    );
    expect(globalBlock['Permissions-Policy']).toBeTruthy();
  });

  it('pins HSTS to at least a year and covers subdomains', () => {
    const hsts = globalBlock['Strict-Transport-Security'] ?? '';
    const maxAge = Number(hsts.match(/max-age=(\d+)/)?.[1] ?? 0);

    expect(maxAge, `Strict-Transport-Security: ${hsts}`).toBeGreaterThanOrEqual(
      31536000,
    );
    expect(hsts.toLowerCase()).toContain('includesubdomains');
  });

  it('caches the hashed /assets/* bundles for a year', () => {
    expect(assetsBlock, '_headers is missing an /assets/* block').toBeTruthy();

    const cacheControl = assetsBlock['Cache-Control'] ?? '';
    const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] ?? 0);

    expect(maxAge, `Cache-Control: ${cacheControl}`).toBeGreaterThanOrEqual(
      31536000,
    );
    expect(cacheControl).toContain('immutable');
    expect(cacheControl).toContain('public');
  });
});

describe('Content-Security-Policy', () => {
  it('locks down the dangerous directives', () => {
    expect(csp['object-src']).toEqual(["'none'"]);
    expect(csp['base-uri']).toEqual(["'self'"]);
    expect(csp['frame-ancestors']).toEqual(["'none'"]);
    expect(csp['default-src']).toEqual(["'self'"]);
  });

  it('never falls back to unsafe-inline or unsafe-eval', () => {
    for (const [directive, sources] of Object.entries(csp)) {
      expect(sources, `${directive} allows an unsafe source`).not.toContain(
        "'unsafe-inline'",
      );
      expect(sources, `${directive} allows an unsafe source`).not.toContain(
        "'unsafe-eval'",
      );
    }
  });

  it('carries one script hash for each inline script', () => {
    expect(
      inlineHashes.length,
      'expected the inline Plausible bootstrap in index.html',
    ).toBe(1);

    // A hash left behind after its script is deleted is dead weight that
    // quietly re-authorizes whatever happens to match it later.
    const listed = (csp['script-src'] ?? []).filter((source) =>
      source.startsWith("'sha256-"),
    );
    expect(listed).toHaveLength(inlineHashes.length);
  });

  it.skipIf(!hasBuild)('hashes what the build actually ships', () => {
    // Vite copies classic inline scripts into dist verbatim, so the hash can
    // be computed from the source file. This check is what tells us if a
    // future Vite version starts rewriting them instead.
    const shipped = inlineScriptBodies(readFileSync(distIndexPath, 'utf8')).map(
      sha256,
    );

    expect(shipped).toEqual(inlineHashes);
  });

  // Prettier once reformatted the inline Plausible script and silently
  // invalidated this hash, which blocked analytics in production. The script
  // now sits behind a prettier-ignore; this keeps the two in lockstep.
  it('keeps the script-src hash in sync with the inline script in index.html', () => {
    for (const hash of inlineHashes) {
      expect(
        csp['script-src'],
        `script-src should contain '${hash}'`,
      ).toContain(`'${hash}'`);
    }
  });

  it('allows every external origin the page actually loads', () => {
    const references = collectExternalReferences();
    expect(references.length).toBeGreaterThan(0);

    for (const { origin, context } of references) {
      const directive = CONTEXT_DIRECTIVE[context];
      expect(
        ALLOWED_ORIGINS[origin],
        `${origin} is referenced by index.html/src (as a ${context}) but is not in ` +
          `this test's allow-list; add it there and to the ` +
          `${directive ?? 'matching'} directive in public/_headers`,
      ).toBeTruthy();

      if (!directive) continue;
      expect(
        csp[directive],
        `CSP ${directive} does not allow ${origin}, which index.html loads as a ${context}`,
      ).toContain(origin);
    }
  });

  it('lists each allowed origin in every directive it needs', () => {
    for (const [origin, directives] of Object.entries(ALLOWED_ORIGINS)) {
      for (const directive of directives) {
        expect(
          csp[directive],
          `CSP ${directive} is missing ${origin}`,
        ).toContain(origin);
      }
    }
  });

  it('does not allow origins the site no longer uses', () => {
    const referenced = new Set(
      collectExternalReferences().map(({ origin }) => origin),
    );

    for (const sources of Object.values(csp)) {
      for (const source of sources) {
        if (!/^https?:\/\//i.test(source)) continue;
        expect(
          referenced.has(source),
          `CSP allows ${source} but nothing in index.html or src/ references it`,
        ).toBe(true);
      }
    }
  });
});
