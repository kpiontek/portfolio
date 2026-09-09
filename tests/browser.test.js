// Drives the built site in a real Chromium and checks the things only a
// browser can see.
//
// Real regressions this catches: a runtime error that never shows up in an SSR
// render, a WCAG failure introduced by a color tweak (contrast is a rendered
// property, so no static check finds it), the IntersectionObserver that starts
// the product recordings silently breaking, hydration mismatching the
// prerendered markup and throwing the whole page away, and the mobile menu
// losing its aria-expanded state or its Escape handling.
//
// Runs against `vite preview` over dist/ by default, or against
// process.env.PORTFOLIO_URL (used to verify kylepiontek.com after a deploy).
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview } from 'vite';
import axeCore from 'axe-core';

// axe is injected from node_modules, never a CDN: the audit has to run the
// version this repo pinned, and the live site's CSP would block a remote one.
const AXE_PATH = createRequire(import.meta.url).resolve('axe-core/axe.min.js');
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const root = fileURLToPath(new URL('..', import.meta.url));
const liveUrl = process.env.PORTFOLIO_URL;
const hasBuild = existsSync(join(root, 'dist/index.html'));
const canRun = Boolean(liveUrl) || hasBuild;

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const CONTEXTS = [
  {
    name: 'desktop light',
    options: {
      viewport: DESKTOP,
      colorScheme: 'light',
      reducedMotion: 'no-preference',
    },
  },
  {
    name: 'desktop dark',
    options: {
      viewport: DESKTOP,
      colorScheme: 'dark',
      reducedMotion: 'no-preference',
    },
  },
  {
    name: 'mobile',
    options: {
      viewport: MOBILE,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3,
      colorScheme: 'light',
      reducedMotion: 'no-preference',
    },
  },
];

if (!canRun) {
  describe('browser', () => {
    it.skip('needs dist/index.html: run `npm run build` before `npx vitest run`, or set PORTFOLIO_URL to check a deployed site', () => {});
  });
} else {
  let previewServer;
  let browser;
  let baseUrl;

  /**
   * Console noise that is not the site's fault: Plausible refuses to record
   * localhost, and the browser cancels video range requests as soon as it has
   * buffered enough. Failures from the site's own origin are never ignored.
   */
  function isExpectedNoise({ text, url }) {
    if (/Ignoring Event: localhost/i.test(text)) return true;
    if (/net::ERR_ABORTED/i.test(text)) return true;
    if (/Failed to load resource/i.test(text)) {
      return Boolean(url) && !url.startsWith(new URL(baseUrl).origin);
    }
    return false;
  }

  async function openPage(options) {
    const context = await browser.newContext(options);
    // addInitScript is injected through the debugger, so it works even under
    // the site's own Content-Security-Policy when running against production.
    await context.addInitScript({ path: AXE_PATH });

    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const entry = { text: message.text(), url: message.location()?.url };
      if (!isExpectedNoise(entry)) consoleErrors.push(entry.text);
    });
    page.on('pageerror', (error) => pageErrors.push(String(error)));

    await page.goto(baseUrl, { waitUntil: 'load', timeout: 20_000 });
    await page.waitForTimeout(800);

    if (!(await page.evaluate(() => typeof window.axe !== 'undefined'))) {
      await page.addScriptTag({ path: AXE_PATH });
    }

    return { context, page, consoleErrors, pageErrors };
  }

  async function runAxe(page) {
    return page.evaluate(
      async (tags) =>
        window.axe.run(document, { runOnly: { type: 'tag', values: tags } }),
      AXE_TAGS,
    );
  }

  function describeViolations(violations) {
    return violations
      .map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.help}\n` +
          `    ${violation.nodes[0]?.target?.join(' ') ?? '(no target)'}`,
      )
      .join('\n');
  }

  beforeAll(async () => {
    if (liveUrl) {
      baseUrl = liveUrl;
    } else {
      previewServer = await preview({
        root,
        preview: { port: 0, strictPort: false },
        logLevel: 'silent',
      });
      baseUrl = previewServer.resolvedUrls.local[0];
    }

    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser?.close();
    if (previewServer) {
      await previewServer.close?.();
      previewServer.httpServer?.close?.();
    }
  });

  describe.each(CONTEXTS)('$name', ({ options }) => {
    it('loads without console or page errors', async () => {
      const { context, page, consoleErrors, pageErrors } =
        await openPage(options);

      try {
        await page
          .locator('h1')
          .first()
          .waitFor({ state: 'visible', timeout: 10_000 });
        expect(pageErrors, pageErrors.join('\n')).toEqual([]);
        expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
      } finally {
        await context.close();
      }
    });

    it('has no axe violations for WCAG 2.2 AA', async () => {
      const { context, page } = await openPage(options);

      try {
        const results = await runAxe(page);
        expect(
          results.violations,
          `axe-core ${axeCore.version} found ${results.violations.length} ` +
            `violation(s):\n${describeViolations(results.violations)}`,
        ).toEqual([]);
        // Guards the run itself: zero passes means axe never inspected anything.
        expect(results.passes.length).toBeGreaterThan(0);
      } finally {
        await context.close();
      }
    });
  });

  describe('desktop behavior', () => {
    it('plays a product recording once its card scrolls into view', async () => {
      const { context, page } = await openPage(CONTEXTS[0].options);

      try {
        await page.locator('.project-card').first().scrollIntoViewIfNeeded();
        await page.waitForFunction(
          () => {
            const video = document.querySelector('.project-card video');
            return Boolean(video) && !video.paused;
          },
          undefined,
          { timeout: 2500 },
        );
      } finally {
        await context.close();
      }
    });

    it('hydrates the prerendered markup instead of replacing it', async () => {
      const { context, page, consoleErrors, pageErrors } = await openPage(
        CONTEXTS[0].options,
      );

      try {
        // React 18 stamps the container it hydrated into with an internal key.
        const hydrated = await page.evaluate(() => {
          const container = document.getElementById('root');
          return (
            Boolean(container) &&
            Object.keys(container).some((key) =>
              key.startsWith('__reactContainer'),
            )
          );
        });
        expect(hydrated, '#root has no React container key').toBe(true);

        // A hydration mismatch logs an error and silently client-renders.
        expect(pageErrors, pageErrors.join('\n')).toEqual([]);
        expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);

        // The server response itself has to carry the markup, not just the
        // hydrated DOM: this is what crawlers and link previews read.
        const served = await fetch(baseUrl).then((response) => response.text());
        expect(served).toContain('<h1>');
      } finally {
        await context.close();
      }
    });
  });

  describe('mobile menu', () => {
    it('toggles with the button and closes on Escape', async () => {
      const { context, page } = await openPage(CONTEXTS[2].options);

      try {
        const toggle = page.locator('button[aria-expanded]').first();
        await toggle.waitFor({ state: 'visible', timeout: 10_000 });
        expect(await toggle.getAttribute('aria-expanded')).toBe('false');

        // The body class is what locks scrolling behind the open panel.
        const menuState = () =>
          page.evaluate(() => ({
            expanded: document
              .querySelector('button[aria-expanded]')
              ?.getAttribute('aria-expanded'),
            bodyLocked: document.body.classList.contains('menu-open'),
          }));

        await toggle.click();
        await page.waitForFunction(
          () => document.body.classList.contains('menu-open'),
          undefined,
          { timeout: 5000 },
        );
        expect(await menuState()).toEqual({
          expanded: 'true',
          bodyLocked: true,
        });

        await page.keyboard.press('Escape');
        await page.waitForFunction(
          () => !document.body.classList.contains('menu-open'),
          undefined,
          { timeout: 5000 },
        );
        expect(await menuState()).toEqual({
          expanded: 'false',
          bodyLocked: false,
        });
      } finally {
        await context.close();
      }
    });
  });
}
