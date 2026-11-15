import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import App from '@core/App';

test('renders the bootstrap application', () => {
  const markup = renderToStaticMarkup(<App />);

  expect(markup).toContain('<main');
  expect(markup).toContain('<h1>Möbius Universe</h1>');
});
