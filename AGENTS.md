# AGENTS.md

Guidance for anyone, human or agent, working in this repository. `CLAUDE.md` points here so the two cannot drift.

## What this is

The source for kylepiontek.com, Kyle Piontek's one-page portfolio. React 18, Vite 8, Sass. The whole UI lives in `src/Portfolio.jsx` with its styles in `src/Portfolio.scss`. That is deliberate for a site this size; do not split it into a component tree.

## Commands

- `npm run dev` starts the dev server (no prerendering, client render only)
- `npm run build` runs the client build, an SSR build of `src/entry-server.jsx`, then `scripts/prerender.mjs`, which writes the rendered markup into `dist/index.html`; `src/main.jsx` hydrates it in the browser
- `npm run preview` serves `dist/`
- `npm run lint`, `npm run format:check`, `npm run knip`, `npm test` are the checks CI runs; `npm test` expects `dist/` to exist, so build first
- `npm run verify:deploy` polls the live site after a push and checks headers and endpoints

Git hooks are managed by lefthook (`lefthook.yml`). Pre-commit formats and lints staged files and scans for secrets. Pre-push runs the same sequence as `.github/workflows/quality.yml`. Bypass only for an emergency with `LEFTHOOK=0`.

## Deployment

Cloudflare Pages builds and deploys `dist/` on every push to `main`. Security headers live in `public/_headers`; the Content-Security-Policy allows the inline Plausible init script by hash, so editing that script means recomputing the hash (the headers test will tell you).

## Rules that are enforced

- No em dashes or en dashes anywhere in source or copy. Use commas, periods, or colons.
- Plain voice. This is a portfolio, not marketing copy. No taglines, no buzzwords.
- Product links read "Visit {Name}". Links that open a new tab say so for screen readers.
- No inline `style=` attributes; the CSP has no `unsafe-inline`.
- WCAG 2.2 AA. The browser test runs axe in light, dark, and mobile contexts.
- Every asset under `src/assets` must be imported; every poster is 1200x750.
- Commits are authored as Kyle Piontek with no tool attribution or trailers.
- Commit subjects are plain English: a capitalized imperative verb and a specific object, at most ten words and sixty characters, no `feat:` style prefix, no colon, no trailing punctuation. The body, if any, is at most four short lines of reasoning that the diff does not show. `scripts/check-commit-message.mjs` enforces this from the commit-msg hook and on pull request titles. Example: `Add security headers for Cloudflare Pages`.

The tests under `tests/` encode these rules. When one fails, fix the site, not the test, unless the rule itself is being changed on purpose.

## Design

`DESIGN.md` documents the visual system: palette for both color schemes, type scale, spacing, the hero pointer effect, and the card treatment. Read it before changing anything visual.
