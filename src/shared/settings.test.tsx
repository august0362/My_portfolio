import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, test, vi } from 'vitest';
import { SettingsProvider, useSettings } from './settings';

afterEach(() => vi.unstubAllGlobals());

function ReadSettings() {
  const { settings } = useSettings();
  return <output>{`${settings.motion}/${settings.quality}/${settings.sound}`}</output>;
}

function renderSettings() {
  return renderToStaticMarkup(<SettingsProvider><ReadSettings /></SettingsProvider>);
}

test('defaults to system reduced motion, full quality and sound off', () => {
  vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
  expect(renderSettings()).toContain('reduced/full/false');
});

test('restores valid saved preferences', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ motion: 'reduced', quality: 'lite', sound: true }),
  });
  expect(renderSettings()).toContain('reduced/lite/true');
});

test.each(['invalid JSON', '{"motion":"invalid","quality":"invalid","sound":"true"}'])(
  'ignores malformed or invalid preferences: %s', (saved) => {
    vi.stubGlobal('localStorage', { getItem: () => saved });
    expect(renderSettings()).toContain('full/full/false');
  },
);

test('works when storage access is blocked', () => {
  vi.stubGlobal('localStorage', { getItem: () => { throw new Error('Storage blocked'); } });
  expect(renderSettings()).toContain('full/full/false');
});
