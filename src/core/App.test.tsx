import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { expect, test } from 'vitest';
import App from '@core/App';
import { WORLDS } from '@core/registry';
import { SettingsProvider } from '@shared/settings';

function renderRoute(path: string) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <SettingsProvider><App /></SettingsProvider>
    </MemoryRouter>,
  );
}

test('the Portal links to all five worlds', () => {
  const markup = renderRoute('/');
  expect(markup).toContain('id="hub-title"');
  expect(markup).not.toMatch(/m[oö]bius/i);
  for (const world of WORLDS) expect(markup).toContain(`href="${world.path}"`);
  expect(markup).not.toContain('Return to the Portal');
});

test('unknown routes provide a 404 and a way back to the Portal', () => {
  const markup = renderRoute('/unknown/page');
  expect(markup).toContain('404 — Page not found');
  expect(markup).toContain('href="/"');
  expect(markup).toContain('Return to the Portal');
});
