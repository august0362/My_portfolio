import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, test, vi } from 'vitest';
import { SettingsProvider, useSettings } from './settings';

afterEach(() => vi.unstubAllGlobals());

function ReadSettings() {
  const { settings } = useSettings();
  return <output>{`${settings.motion}/${settings.quality}/${settings.sound}/${settings.appearance}/${settings.palette}/${settings.language}`}</output>;
}

function renderSettings() {
  return renderToStaticMarkup(<SettingsProvider><ReadSettings /></SettingsProvider>);
}

test('respects reduced motion while keeping full detail and sound enabled', () => {
  vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
  expect(renderSettings()).toContain('reduced/full/true/dark/iris/');
});

test('restores the site appearance, palette and language', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ motion: 'reduced', quality: 'lite', sound: false, appearance: 'light', palette: 'dream', language: 'vi' }),
  });
  expect(renderSettings()).toContain('full/full/true/light/dream/vi');
});

test.each([['moonlit', 'iris'], ['rosewater', 'sakura'], ['tidal', 'jade'], ['lagoon', 'dream']])('migrates the old %s palette to %s', (old, next) => {
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify({ palette: old }) });
  expect(renderSettings()).toContain(`/${next}/`);
});

test.each(['invalid JSON', '{"appearance":"system","palette":"invalid","language":"fr"}'])(
  'ignores malformed or invalid preferences: %s', (saved) => {
    vi.stubGlobal('localStorage', { getItem: () => saved });
    vi.stubGlobal('navigator', { language: 'en-US' });
    expect(renderSettings()).toContain('full/full/true/dark/iris/en');
  },
);

test('defaults to Vietnamese for a Vietnamese browser', () => {
  vi.stubGlobal('navigator', { language: 'vi-VN' });
  vi.stubGlobal('localStorage', { getItem: () => null });
  expect(renderSettings()).toContain('/vi');
});

test('works when storage access is blocked', () => {
  vi.stubGlobal('localStorage', { getItem: () => { throw new Error('Storage blocked'); } });
  vi.stubGlobal('navigator', { language: 'en' });
  expect(renderSettings()).toContain('full/full/true/dark/iris/en');
});

test('browser color scheme does not select the site appearance', () => {
  vi.stubGlobal('window', { matchMedia: (query: string) => ({ matches: query.includes('prefers-color-scheme') }) });
  expect(renderSettings()).toContain('full/full/true/dark/iris/');
});
