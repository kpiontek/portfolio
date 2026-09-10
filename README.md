# kylepiontek.com

Source for my personal portfolio site at [kylepiontek.com](https://kylepiontek.com). It is a single page covering my work, background, and contact details.

## Stack

- React 18
- Vite 8
- Sass
- Cloudflare Pages

## How it is built

The page is one component, `src/Portfolio.jsx`, styled by `src/Portfolio.scss`. A production build runs three steps: a client build, an SSR build of `src/entry-server.jsx`, and `scripts/prerender.mjs`, which renders the app to HTML and injects that markup into `dist/index.html`. In the browser, `src/main.jsx` hydrates the prerendered markup instead of rendering the page from scratch.

Deploys go to Cloudflare Pages. Every push to `main` triggers a build, and the contents of `./dist` are served as static assets. Security headers, including a Content-Security-Policy with no `unsafe-inline`, live in `public/_headers`.

## Local development

```bash
npm install
npm run dev
npm run build
npm run preview
```

The dev server does not prerender. It serves an empty root, so `src/main.jsx` falls back to a client render there. `npm install` also installs the git hooks through lefthook.

To run the checks locally:

```bash
npm run lint
npm run format:check
npm run knip
npm run build
npm test
```

`npm test` reads `dist/`, so build first. The browser tests need Chromium, which `npx playwright install chromium` downloads once.

## Checks

The same sequence runs as a lefthook pre-push hook and in GitHub Actions on every pull request and push. Pre-commit formats and lints staged files and scans them for secrets with gitleaks, and a commit-msg hook holds commit subjects to plain English: a capitalized imperative verb and a specific object, no prefixes, at most ten words. The rules are spelled out in [AGENTS.md](AGENTS.md).

The tests under `tests/` check the things that matter for this site rather than React internals: the Content-Security-Policy matches the inline script and every external origin the page loads, no asset is dead, every poster is 1200x750, the copy contains no em dashes, the prerendered HTML contains the page, and a real Chromium run passes axe for WCAG 2.2 AA in light, dark, and mobile.

After each push to `main`, a second workflow waits for Cloudflare Pages to publish that commit, checks the live headers and endpoints with `scripts/verify-deploy.mjs`, and runs the browser suite against kylepiontek.com. Dependabot keeps npm packages and the pinned GitHub Actions current.

## Design

Colors, typography, layout, and component rules are documented in [DESIGN.md](DESIGN.md). The site ships light and dark color schemes, selected with `prefers-color-scheme`.

## Accessibility

The site is checked against WCAG 2.2 AA with axe. Product cards use short screen recordings (webm and mp4 with poster frames) that play only while in view and stay paused for visitors who set `prefers-reduced-motion`.

## Security

Report anything that could affect visitors to hello@kylepiontek.com. See [SECURITY.md](SECURITY.md) and the `security.txt` served at [kylepiontek.com/.well-known/security.txt](https://kylepiontek.com/.well-known/security.txt).

## License

The code in this repository is MIT licensed. See [LICENSE](LICENSE).

The content is not. The photo, resume, written copy, endorsement quote, and product recordings and images under `src/assets` and `public` are copyright Kyle Piontek, all rights reserved, and may not be reused.
