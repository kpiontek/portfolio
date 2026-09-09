// Checks the head of index.html: the tags that decide how the site looks in
// search results, in a shared link preview, and on a phone home screen.
//
// Real regressions this catches: a duplicated or missing <title>, a
// description that Google truncates or ignores, an og:image pointing at a
// file that was renamed out of public/ (which turns every shared link into a
// grey box, and nothing in the app ever errors), a JSON-LD block broken by a
// stray comma, a theme-color that only covers one color scheme, and favicon
// links left pointing at deleted files.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const html = readFileSync(join(root, 'index.html'), 'utf8');

const SITE_ORIGIN = 'https://kylepiontek.com';

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

const tags = (name) =>
  [...html.matchAll(new RegExp(`<${name}\\b([^>]*?)/?>`, 'gi'))].map((match) =>
    parseAttributes(match[1]),
  );

const metas = tags('meta');
const links = tags('link');

const meta = (key) =>
  metas.find((tag) => tag.name === key || tag.property === key)?.content ?? '';

/** Turns an absolute site URL into the file that should back it in public/. */
function publicFileFor(url) {
  expect(url, 'expected an absolute https URL').toMatch(/^https:\/\//);
  const { origin, pathname } = new URL(url);
  expect(origin).toBe(SITE_ORIGIN);
  return join(root, 'public', pathname);
}

describe('document head', () => {
  it('declares English on <html>', () => {
    expect(html).toMatch(/<html\b[^>]*\blang="en"/);
  });

  it('has exactly one title', () => {
    const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
    expect(titles).toHaveLength(1);
    expect(titles[0][1].trim()).toBe(
      'Kyle Piontek | Senior Full Stack Developer',
    );
  });

  it('has a description search engines will actually show', () => {
    const description = meta('description');
    // Under ~50 characters reads as an unfinished draft; over ~160 gets cut.
    expect(description.length).toBeGreaterThanOrEqual(50);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it('sets a theme-color for both color schemes', () => {
    const themeColors = metas.filter((tag) => tag.name === 'theme-color');
    const schemes = themeColors.map((tag) => tag.media);

    expect(schemes).toContain('(prefers-color-scheme: light)');
    expect(schemes).toContain('(prefers-color-scheme: dark)');
    for (const tag of themeColors) {
      expect(tag.content).toMatch(/^#[0-9a-f]{3,8}$/i);
    }
  });
});

describe('social previews', () => {
  it('fills in the Open Graph tags', () => {
    expect(meta('og:title')).not.toBe('');
    expect(meta('og:description').length).toBeGreaterThanOrEqual(50);
    expect(meta('og:url')).toBe(SITE_ORIGIN);
    expect(meta('og:type')).toBe('website');
  });

  it('points og:image at a file that ships', () => {
    const path = publicFileFor(meta('og:image'));
    expect(existsSync(path), `${meta('og:image')} has no file in public/`).toBe(
      true,
    );
    // Platforms use the declared size to lay the card out before the fetch.
    expect(meta('og:image:width')).toBe('1200');
    expect(meta('og:image:height')).toBe('630');
    expect(meta('og:image:alt')).not.toBe('');
  });

  it('asks for a large Twitter card', () => {
    expect(meta('twitter:card')).toBe('summary_large_image');
    expect(meta('twitter:title')).not.toBe('');
    expect(meta('twitter:description')).not.toBe('');
    expect(existsSync(publicFileFor(meta('twitter:image')))).toBe(true);
  });
});

describe('JSON-LD', () => {
  const blocks = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];

  it('has a single block that parses', () => {
    expect(blocks).toHaveLength(1);
    expect(() => JSON.parse(blocks[0][1])).not.toThrow();
  });

  it('describes the person, not a generic website', () => {
    const data = JSON.parse(blocks[0][1]);

    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Kyle Piontek');
    expect(data.url).toBe(SITE_ORIGIN);
    expect(Array.isArray(data.sameAs)).toBe(true);
    expect(data.sameAs.length).toBeGreaterThan(0);
    for (const profile of data.sameAs) {
      expect(profile).toMatch(/^https:\/\//);
    }
  });

  it('points the image at a file that ships', () => {
    const data = JSON.parse(blocks[0][1]);
    const path = publicFileFor(data.image);
    expect(existsSync(path), `${data.image} has no file in public/`).toBe(true);
  });
});

describe('icons', () => {
  const iconLinks = links.filter((link) =>
    ['icon', 'apple-touch-icon', 'shortcut icon', 'mask-icon'].includes(
      (link.rel ?? '').toLowerCase(),
    ),
  );

  it('links at least an ico, an svg, and an apple touch icon', () => {
    const hrefs = iconLinks.map((link) => link.href);
    expect(hrefs).toContain('/favicon.ico');
    expect(hrefs).toContain('/favicon.svg');
    expect(hrefs).toContain('/apple-touch-icon.png');
  });

  it('resolves every icon to a file in public/', () => {
    expect(iconLinks.length).toBeGreaterThan(0);

    for (const link of iconLinks) {
      expect(link.href, 'icons are served from the site root').toMatch(/^\//);
      const path = join(root, 'public', link.href);
      expect(existsSync(path), `${link.href} has no file in public/`).toBe(
        true,
      );
    }
  });
});
