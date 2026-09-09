// Checks the files the page ships: the imports resolve, nothing is dead
// weight, and every image is the size the layout and the social platforms
// expect.
//
// Real regressions this catches: renaming a recording without updating the
// import (which fails the build, but slowly), leaving an orphaned 3 MB video
// in the repo after replacing a product card, re-exporting a poster at the
// wrong aspect ratio so the card jumps on load, and an og.jpg or
// apple-touch-icon that platforms silently refuse to crop the way you expect.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const srcDir = join(root, 'src');
const assetsDir = join(srcDir, 'assets');
const projectsDir = join(assetsDir, 'projects');

const PROJECT_SLUGS = [
  'sitecmd',
  'visit-your-team',
  'was-it-vibed',
  'smarthomeu',
];

const ASSET_EXTENSIONS = new Set([
  '.webp',
  '.webm',
  '.mp4',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.svg',
  '.avif',
]);

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

const sourceFiles = walk(srcDir).filter((path) =>
  ['.js', '.jsx', '.mjs'].includes(extname(path)),
);

/**
 * Every asset path imported anywhere under src/, resolved to an absolute path.
 * Reading the imports rather than the bundle keeps this honest even when a
 * build has not run.
 */
const importedAssets = new Set();
for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  const pattern = /from\s+['"](\.[^'"]+)['"]/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    if (!ASSET_EXTENSIONS.has(extname(match[1]))) continue;
    importedAssets.add(resolve(dirname(file), match[1]));
  }
}

const portfolioSource = readFileSync(join(srcDir, 'Portfolio.jsx'), 'utf8');
const shortPath = (path) => relative(root, path);

describe('imported assets', () => {
  it('resolves every asset imported by src/Portfolio.jsx', () => {
    const pattern = /from\s+['"](\.[^'"]+)['"]/g;
    const missing = [];
    let found = 0;
    let match;

    while ((match = pattern.exec(portfolioSource)) !== null) {
      if (!ASSET_EXTENSIONS.has(extname(match[1]))) continue;
      found += 1;
      const path = resolve(srcDir, match[1]);
      if (!existsSync(path)) missing.push(`${match[1]} -> ${shortPath(path)}`);
    }

    // 12 recordings and posters plus the headshot.
    expect(found).toBe(13);
    expect(missing, `missing files:\n${missing.join('\n')}`).toEqual([]);
  });

  it('has no dead assets under src/assets', () => {
    const orphans = walk(assetsDir)
      .filter((path) => !importedAssets.has(path))
      .map(shortPath);

    expect(
      orphans,
      `these files are committed but never imported:\n${orphans.join('\n')}`,
    ).toEqual([]);
  });

  it('imports nothing that is not on disk', () => {
    const broken = [...importedAssets].filter((path) => !existsSync(path));
    expect(broken.map(shortPath)).toEqual([]);
  });
});

describe('product recordings', () => {
  it.each(PROJECT_SLUGS)('%s has a webm, an mp4, and a poster', (slug) => {
    for (const file of [`${slug}.webm`, `${slug}.mp4`, `${slug}-poster.webp`]) {
      expect(existsSync(join(projectsDir, file)), `missing ${file}`).toBe(true);
    }
  });

  it.each(PROJECT_SLUGS)('%s poster is a 1200x750 webp', async (slug) => {
    const metadata = await sharp(
      join(projectsDir, `${slug}-poster.webp`),
    ).metadata();

    expect(metadata.format).toBe('webp');
    // 16:10, matching the width/height on the <video> so the card reserves the
    // right space before the recording loads.
    expect([metadata.width, metadata.height]).toEqual([1200, 750]);
  });

  it('has exactly the expected files under src/assets/projects', () => {
    const expected = PROJECT_SLUGS.flatMap((slug) => [
      `${slug}-poster.webp`,
      `${slug}.mp4`,
      `${slug}.webm`,
    ]).sort();

    expect(
      walk(projectsDir)
        .map((path) => path.split('/').pop())
        .sort(),
    ).toEqual(expected);
  });
});

describe('public files', () => {
  it('ships a 1200x630 og.jpg', async () => {
    const metadata = await sharp(join(root, 'public/og.jpg')).metadata();
    expect(metadata.format).toBe('jpeg');
    expect([metadata.width, metadata.height]).toEqual([1200, 630]);
  });

  it('ships a 180x180 apple-touch-icon.png', async () => {
    const metadata = await sharp(
      join(root, 'public/apple-touch-icon.png'),
    ).metadata();
    expect(metadata.format).toBe('png');
    expect([metadata.width, metadata.height]).toEqual([180, 180]);
  });

  it('ships a favicon.svg with a viewBox so it scales', () => {
    const svg = readFileSync(join(root, 'public/favicon.svg'), 'utf8').trim();

    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
    expect(svg).toMatch(/xmlns=["']http:\/\/www\.w3\.org\/2000\/svg["']/);
    expect(svg).toMatch(/viewBox=["'][\d.\s-]+["']/);
  });

  it('ships a real resume PDF that the page links to', () => {
    const path = join(root, 'public/Kyle_Piontek_Resume.pdf');
    expect(existsSync(path)).toBe(true);

    // A LibreOffice export that failed halfway still leaves a file behind.
    expect(readFileSync(path).subarray(0, 4).toString('latin1')).toBe('%PDF');
    expect(portfolioSource).toContain('/Kyle_Piontek_Resume.pdf');
  });
});

describe('public/.well-known/security.txt', () => {
  const text = readFileSync(
    join(root, 'public/.well-known/security.txt'),
    'utf8',
  );
  const field = (name) =>
    text.match(new RegExp(`^${name}:\\s*(.+)$`, 'im'))?.[1]?.trim() ?? '';

  it('names a contact and a canonical location', () => {
    expect(field('Contact')).toMatch(/^mailto:.+@.+\..+$/);
    expect(field('Canonical')).toBe(
      'https://kylepiontek.com/.well-known/security.txt',
    );
  });

  it('has not expired', () => {
    const expires = field('Expires');
    expect(expires, 'security.txt needs an Expires field').not.toBe('');

    const date = new Date(expires);
    expect(Number.isNaN(date.getTime()), `unparseable date: ${expires}`).toBe(
      false,
    );
    // RFC 9116 says an expired file should be ignored, so a stale date is the
    // same as having no security.txt at all.
    expect(
      date.getTime(),
      `security.txt expired on ${expires}; push the date out`,
    ).toBeGreaterThan(Date.now());
  });
});
