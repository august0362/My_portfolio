import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const css = readFileSync(new URL('./Theme.module.css', import.meta.url), 'utf8');
const palettes = ['moonlit', 'rosewater', 'tidal'];
const appearances = ['dark', 'light'];

function colorsFor(palette: string, appearance: string) {
  const colors: Record<string, string> = {};
  for (const match of css.matchAll(/\.theme([^{}]*)\{([^}]+)\}/g)) {
    const [, selector, body] = match;
    const selectedPalette = selector.match(/data-palette='([^']+)'/)?.[1];
    const selectedAppearance = selector.match(/data-appearance='([^']+)'/)?.[1];
    if (selectedPalette && selectedPalette !== palette || selectedAppearance && selectedAppearance !== appearance) continue;
    for (const color of body.matchAll(/--forge-([\w-]+):\s*(#[a-f\d]{6}|[\d.]+%)/gi)) colors[color[1]] = color[2];
  }
  return colors;
}

function luminance(hex: string) {
  const values = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}
function contrast(a: string, b: string) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
function glassOver(panel: string, background: string, opacity = .94) {
  return '#' + [1, 3, 5].map(offset => Math.round(parseInt(panel.slice(offset, offset + 2), 16) * opacity + parseInt(background.slice(offset, offset + 2), 16) * (1 - opacity)).toString(16).padStart(2, '0')).join('');
}

test.each(palettes.flatMap(palette => appearances.map(appearance => ({ palette, appearance }))))('$palette / $appearance preserves readable text and actions', ({ palette, appearance }) => {
  const colors = colorsFor(palette, appearance);
  const behind = appearance === 'light' ? '#000000' : '#ffffff';
  const glass = glassOver(colors.panel, behind);
  const board = glassOver(colors.raised, behind, parseFloat(colors['board-opacity']) / 100);
  for (const surface of [colors.bg, colors.panel, glass, board]) {
    expect(contrast(colors.text, surface), `${palette} ${appearance} main text`).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.muted, surface), `${palette} ${appearance} secondary text`).toBeGreaterThanOrEqual(4.5);
  }
  expect(contrast(colors['button-text'], colors.button)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(colors.accent, colors.panel)).toBeGreaterThanOrEqual(3);
});
