// Enforces the owner's writing rules on everything that ships or is read by a
// human: no em dashes or en dashes anywhere, and no recruiter-repellent
// marketing filler in the copy that search engines and visitors see first.
//
// Real regression this catches: a dash or a word like "passionate" slipping in
// through a paste from a document, an AI-written draft, or a hurried edit. The
// site reads as hand-written, and one stray em dash undoes that.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

// Paths the rules cover. Directories are walked recursively.
const TARGETS = [
  'src',
  'scripts',
  'tests',
  'index.html',
  'README.md',
  'public/_headers',
];

const SKIP_DIRECTORIES = new Set(['node_modules', 'dist', '.git']);

// Media and other binaries never carry prose.
const BINARY_EXTENSIONS = new Set([
  '.webp',
  '.webm',
  '.mp4',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.ico',
  '.pdf',
  '.woff',
  '.woff2',
  '.ttf',
]);

// Written as escapes so this file does not trip its own rule.
const EM_DASH = '\u2014';
const EN_DASH = '\u2013';

// Words the owner rejected. Plain adjectives that say nothing about the work.
const BANNED_MARKETING_WORDS = [
  'passionate',
  'leverage',
  'cutting-edge',
  'seamless',
  'world-class',
];

function collectFiles(target) {
  const absolute = join(root, target);
  const stats = statSync(absolute);
  if (!stats.isDirectory()) return [absolute];

  const files = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRECTORIES.has(entry.name)) continue;
        walk(path);
      } else if (entry.isFile()) {
        files.push(path);
      }
    }
  };
  walk(absolute);
  return files;
}

function readTextFile(path) {
  if (BINARY_EXTENSIONS.has(extname(path).toLowerCase())) return null;

  const buffer = readFileSync(path);
  // A NUL byte in the first chunk means it is not text, whatever the name says.
  if (buffer.subarray(0, 8000).includes(0)) return null;
  return buffer.toString('utf8');
}

const textFiles = TARGETS.flatMap(collectFiles)
  .map((path) => ({ path, text: readTextFile(path) }))
  .filter(({ text }) => text !== null);

/** Reads the content of a `<meta>` tag by name or property. */
function metaContent(html, key) {
  const pattern = new RegExp(
    `<meta\\b[^>]*(?:name|property)=["']${key}["'][^>]*>`,
    'i',
  );
  const tag = html.match(pattern)?.[0] ?? '';
  return tag.match(/content=["']([^"']*)["']/i)?.[1] ?? '';
}

const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');
const portfolioSource = readFileSync(join(root, 'src/Portfolio.jsx'), 'utf8');

// The hero is the h1 plus the paragraphs directly under it: the first thing a
// recruiter reads. Sliced straight out of the component source.
const heroMarkup =
  portfolioSource.match(/<section className="hero"[\s\S]*?<\/section>/)?.[0] ??
  '';

describe('no em dashes or en dashes', () => {
  it('scans a meaningful set of files', () => {
    // Guards the walker itself: a broken path list would make this file pass
    // by checking nothing at all.
    expect(textFiles.length).toBeGreaterThan(5);
    expect(
      textFiles.some(({ path }) => path.endsWith('src/Portfolio.jsx')),
    ).toBe(true);
    expect(textFiles.some(({ path }) => path.endsWith('index.html'))).toBe(
      true,
    );
  });

  it('finds none in src, scripts, tests, index.html, README.md, or _headers', () => {
    const offenders = [];

    for (const { path, text } of textFiles) {
      text.split('\n').forEach((line, index) => {
        for (const [dash, label] of [
          [EM_DASH, 'em dash'],
          [EN_DASH, 'en dash'],
        ]) {
          const column = line.indexOf(dash);
          if (column === -1) continue;
          offenders.push(
            `${relative(root, path)}:${index + 1}:${column + 1} ${label} in: ${line.trim()}`,
          );
        }
      });
    }

    expect(
      offenders,
      `Use a comma, a colon, or a rewrite instead:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });
});

describe('marketing filler', () => {
  const surfaces = () => [
    [
      'index.html <title>',
      indexHtml.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '',
    ],
    ['meta description', metaContent(indexHtml, 'description')],
    ['og:title', metaContent(indexHtml, 'og:title')],
    ['og:description', metaContent(indexHtml, 'og:description')],
    ['og:image:alt', metaContent(indexHtml, 'og:image:alt')],
    ['twitter:title', metaContent(indexHtml, 'twitter:title')],
    ['twitter:description', metaContent(indexHtml, 'twitter:description')],
    ['hero section (src/Portfolio.jsx)', heroMarkup],
  ];

  it('reads the surfaces it is supposed to check', () => {
    for (const [label, text] of surfaces()) {
      expect(text.trim(), `${label} came back empty`).not.toBe('');
    }
    expect(heroMarkup).toContain('<h1>');
  });

  it('keeps rejected words out of the hero copy and search metadata', () => {
    const offenders = [];

    for (const [label, text] of surfaces()) {
      for (const word of BANNED_MARKETING_WORDS) {
        if (new RegExp(word.replace('-', '[- ]?'), 'i').test(text)) {
          offenders.push(`${label} contains "${word}"`);
        }
      }
    }

    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
