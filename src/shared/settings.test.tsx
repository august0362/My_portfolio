import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, test, vi } from 'vitest';
import { SettingsProvider, useSettings } from './settings';

afterEach(() => vi.unstubAllGlobals());

function ReadSettings() {
  const { settings } = useSettings();
  return <output>{`${settings.motion}/${settings.quality}/${settings.sound}/${settings.appearance}/${settings.palette}`}</output>;
}

function renderSettings() {
  return renderToStaticMarkup(<SettingsProvider><ReadSettings /></SettingsProvider>);
}

test('respects reduced motion while keeping full detail and sound enabled', () => {
  vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
  expect(renderSettings()).toContain('reduced/full/true/dark/moonlit');
});

test('restores the site appearance and migrates old low-quality or muted preferences', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ motion: 'reduced', quality: 'lite', sound: false, appearance: 'light', palette: 'tidal' }),
  });
  expect(renderSettings()).toContain('full/full/true/light/tidal');
});

test.each(['invalid JSON', '{"appearance":"system","palette":"invalid"}'])(
  'ignores malformed or invalid preferences: %s', (saved) => {
    vi.stubGlobal('localStorage', { getItem: () => saved });
    expect(renderSettings()).toContain('full/full/true/dark/moonlit');
  },
);

test('works when storage access is blocked', () => {
  vi.stubGlobal('localStorage', { getItem: () => { throw new Error('Storage blocked'); } });
  expect(renderSettings()).toContain('full/full/true/dark/moonlit');
});

test('browser color scheme does not select the site appearance', () => {
  vi.stubGlobal('window', { matchMedia: (query: string) => ({ matches: query.includes('prefers-color-scheme') }) });
  expect(renderSettings()).toContain('full/full/true/dark/moonlit');
});
