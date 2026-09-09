import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Portfolio from './Portfolio';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <Portfolio />
  </StrictMode>
);

// The production build ships prerendered markup; the dev server starts empty.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
