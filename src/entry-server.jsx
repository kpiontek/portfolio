import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import Portfolio from './Portfolio';

export function render() {
  return renderToString(
    <StrictMode>
      <Portfolio />
    </StrictMode>,
  );
}
