import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { PALETTES } from '@shared/settings';

const css = readFileSync(new URL('./appearance.css', import.meta.url), 'utf8');

/** Resolves the --portal-* hex colors that apply to one palette and appearance, in cascade order. */
function colorsFor(palette: string, appearance: string) {
  const colors: Record<string, string> = {};
  for (const [, selector, body] of css.matchAll(/:root([^{]*)\{([^}]+)\}/g)) {
    const selected = selector.match(/data-palette='([^']+)'/)?.[1];
    const mode = selector.match(/data-appearance='([^']+)'/)?.[1];
    if ((selected && selected !== palette) || (mode && mode !== appearance)) continue;
    for (const [, name, value] of body.matchAll(/--portal-([\w-]+):\s*(#[a-f\d]{6})/gi)) colors[name] = value;
  }
  return colors;
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

test.each(PALETTES.flatMap((palette) => ['dark', 'light'].map((appearance) => ({ palette, appearance }))))(
  '$palette / $appearance keeps the portal and shell readable',
  ({ palette, appearance }) => {
    const c = colorsFor(palette, appearance);
    for (const surface of [c.bg, c.mid, c.panel, c.card]) {
      expect(contrast(c.text, surface), `${palette} ${appearance} text`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c.muted, surface), `${palette} ${appearance} muted`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c.accent, surface), `${palette} ${appearance} link`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c.gold, surface), `${palette} ${appearance} focus`).toBeGreaterThanOrEqual(3);
    }
  },
);
