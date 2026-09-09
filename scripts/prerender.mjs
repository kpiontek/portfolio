// Renders the app to static HTML after `vite build` so dist/index.html ships
// the full page instead of an empty root. main.jsx hydrates it in the browser.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Load React's production build so the render matches the client bundle and
// stays free of development-only warnings.
process.env.NODE_ENV = 'production';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const serverDir = resolve(dist, 'server');

const { render } = await import(resolve(serverDir, 'entry-server.js'));
const html = render();

const templatePath = resolve(dist, 'index.html');
const template = await readFile(templatePath, 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`);
}

await writeFile(
  templatePath,
  template.replace(marker, `<div id="root">${html}</div>`),
);
await rm(serverDir, { recursive: true, force: true });

console.log(
  `prerendered index.html (${(html.length / 1024).toFixed(1)} KB of markup)`,
);
