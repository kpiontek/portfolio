// Checks what `npm run build` actually leaves in dist/.
//
// The build is three steps: a client build, an SSR build, and
// scripts/prerender.mjs injecting the rendered markup into dist/index.html. If
// the last step silently no-ops, dist/index.html still loads fine in a browser
// (main.jsx client-renders it) and nothing errors, but every crawler and link
// preview sees an empty <div id="root">. These tests are the only thing that
// notices.
//
// They also catch a hashed asset referenced but never emitted, _headers or
// security.txt not being copied out of public/, and the SSR bundle in
// dist/server being left behind for Cloudflare Pages to publish.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const distIndexPath = join(dist, 'index.html');
const hasBuild = existsSync(distIndexPath);

if (!hasBuild) {
  describe('prerendered dist/', () => {
    it.skip('needs dist/index.html: run `npm run build` before `npx vitest run` (CI and the pre-push hook always do)', () => {});
  });
} else {
  const html = readFileSync(distIndexPath, 'utf8');
  const rootDiv = html.match(/<div id="root">([\s\S]*?)<\/body>/)?.[1] ?? '';

  describe('prerendered dist/index.html', () => {
    it('ships the page inside #root instead of an empty div', () => {
      expect(html).not.toContain('<div id="root"></div>');
      expect(rootDiv.length).toBeGreaterThan(2000);
    });

    it('contains the hero heading', () => {
      // React escapes the apostrophe in "I'm Kyle" when it serializes.
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
      const text = h1
        .replace(/<[^>]*>/g, '')
        .replace(/&#x27;|&#39;|&apos;/g, "'");

      expect(text).toContain("I'm Kyle");
    });

    it('contains all four project cards', () => {
      expect(rootDiv.match(/class="project-card"/g) ?? []).toHaveLength(4);
    });

    it('contains the section headings', () => {
      const h2s = [...rootDiv.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(
        (match) => match[1].replace(/<[^>]*>/g, ''),
      );

      expect(h2s).toContain('Selected work');
      expect(h2s).toContain('Experience');
      expect(h2s).toContain('About');
      expect(h2s.length).toBeGreaterThanOrEqual(4);
    });

    it('emitted every hashed asset it references', () => {
      const referenced = [
        ...new Set(
          [...html.matchAll(/["'(](\/assets\/[^"')\s]+)/g)].map(
            (match) => match[1],
          ),
        ),
      ];

      // The bundle, the stylesheet, four posters, and eight recordings.
      expect(referenced.length).toBeGreaterThanOrEqual(14);

      const missing = referenced.filter(
        (url) => !existsSync(join(dist, url.replace(/^\//, ''))),
      );
      expect(
        missing,
        `referenced but not emitted:\n${missing.join('\n')}`,
      ).toEqual([]);
    });
  });

  describe('static files copied into dist/', () => {
    it('copies _headers verbatim', () => {
      const distHeaders = join(dist, '_headers');
      expect(existsSync(distHeaders), 'dist/_headers is missing').toBe(true);
      expect(readFileSync(distHeaders, 'utf8')).toBe(
        readFileSync(join(root, 'public/_headers'), 'utf8'),
      );
    });

    it('copies .well-known/security.txt', () => {
      expect(existsSync(join(dist, '.well-known/security.txt'))).toBe(true);
    });

    it('cleans up the SSR bundle', () => {
      // dist/server is a build artifact for prerender.mjs only. Leaving it in
      // place would publish the server bundle to Cloudflare Pages.
      expect(
        existsSync(join(dist, 'server')),
        'dist/server survived the build; prerender.mjs should remove it',
      ).toBe(false);
    });
  });
}
