import { createContext, use, type CSSProperties } from 'react';
import { ACTIVE_THEME, FONTS, themes } from './theme.config';

/**
 * Theme engine. Colors are edited in theme.config.ts; this file turns a theme's short
 * section definitions into full schemes and CSS variables, and keeps text readable.
 */

export type SectionId = 'identity' | 'journey' | 'gallery' | 'skills' | 'connect';
export const SECTION_ORDER: readonly SectionId[] = ['identity', 'journey', 'gallery', 'skills', 'connect'];

/** Ambient character per section (particle behaviour), independent of colors. */
export type Mood = 'dawn' | 'night' | 'shore' | 'breath' | 'dusk';
export const MOOD: Record<SectionId, Mood> = {
  identity: 'dawn',
  journey: 'night',
  gallery: 'shore',
  skills: 'breath',
  connect: 'dusk',
};

export interface Scheme {
  tone: 'light' | 'dark';
  bg: string;
  bgAlt: string;
  text: string;
  textMuted: string;
  surface: string;
  border: string;
  /** Decorative only: rules, nodes, highlights. */
  accent: string;
  /** Accent that must stay readable on bg/bgAlt (links, labels). */
  accentInk: string;
  glow: string;
  particle: string;
  cloudA: string;
  cloudB: string;
}

/** What a theme author writes per section. Omitted fields are derived. */
export type SectionColors = Pick<Scheme, 'tone' | 'bg' | 'text' | 'accent' | 'particle' | 'cloudA' | 'cloudB'> &
  Partial<Scheme>;

export interface ThemeDef {
  /** Number used by PAIRED_THEMES and ACTIVE_THEME. */
  no: number;
  name: string;
  /** Source palette swatches, for reference. */
  palette: readonly string[];
  sections: Record<SectionId, SectionColors>;
  /** Optional dark-mode overrides per section; anything omitted is derived from `sections`. */
  dark?: Partial<Record<SectionId, Partial<SectionColors>>>;
}

/** Site appearance chosen by the visitor; independent of the browser/OS setting. */
export type Mode = 'light' | 'dark';

export interface Theme {
  no: number;
  name: string;
  mode: Mode;
  palette: readonly string[];
  schemes: Record<SectionId, Scheme>;
}

/* ---------- Color math (sRGB hex) ---------- */

function rgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

const toHex = (c: number[]) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

/** Mixes `b` into `a` by `t` (0..1). Alpha is dropped. */
function mix(a: string, b: string, t: number) {
  const [x, y] = [rgb(a), rgb(b)];
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
}

function luminance(hex: string) {
  const lin = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Returns `fg` unchanged if it already reaches `min` on every background; otherwise nudges it
 * toward `toward` (kept in the theme's hue), then toward black/white as a last resort.
 */
function readable(fg: string, bgs: string[], min: number, toward: string, extreme: string) {
  const ok = (c: string) => bgs.every((bg) => contrast(c, bg) >= min);
  fg = toHex(rgb(fg)); // normalize #rgb / #rrggbbaa
  for (const target of [toward, extreme]) {
    for (let t = 0; t <= 1.0001; t += 0.04) {
      const c = t === 0 ? fg : mix(fg, target, t);
      if (ok(c)) return c;
    }
    fg = target;
  }
  return extreme;
}

const AA = 4.6; // WCAG AA 4.5 with a small margin for rounding.

export function resolveScheme(s: SectionColors): Scheme {
  const dark = s.tone === 'dark';
  const extreme = dark ? '#ffffff' : '#000000';
  const bgAlt = s.bgAlt ?? mix(s.bg, s.cloudA, dark ? 0.22 : 0.3);
  const bgs = [s.bg, bgAlt];
  const text = readable(s.text, bgs, AA + 2, s.text, extreme);
  return {
    tone: s.tone,
    bg: s.bg,
    bgAlt,
    text,
    textMuted: readable(s.textMuted ?? mix(text, s.bg, 0.3), bgs, AA, text, extreme),
    surface: s.surface ?? (dark ? '#ffffff0f' : '#ffffff8c'),
    border: s.border ?? `${text}${dark ? '33' : '2e'}`,
    accent: s.accent,
    accentInk: readable(s.accentInk ?? s.accent, bgs, AA, text, extreme),
    glow: s.glow ?? s.cloudA,
    particle: s.particle,
    cloudA: s.cloudA,
    cloudB: s.cloudB,
  };
}

/**
 * Dark mode: sections that are already dark stay as written. Light sections move onto the
 * theme's deepest night color, tinted by their own cloud color, and their paper becomes the text.
 */
function darkColors(def: ThemeDef, id: SectionId): SectionColors {
  const s = def.sections[id];
  const override = def.dark?.[id] ?? {};
  if (s.tone === 'dark') return { ...s, ...override };
  const night =
    SECTION_ORDER.map((i) => def.sections[i])
      .filter((x) => x.tone === 'dark')
      .map((x) => x.bg)
      .sort((a, b) => luminance(a) - luminance(b))[0] ?? mix(s.text, '#000000', 0.55);
  const dim = (c: string, t: number) => mix(c, night, t);
  return {
    tone: 'dark',
    bg: mix(night, s.cloudB, 0.1),
    text: s.bg,
    accent: s.accent,
    particle: s.particle,
    cloudA: dim(s.cloudA, 0.35),
    cloudB: dim(s.cloudB, 0.35),
    glow: dim(s.glow ?? s.cloudA, 0.3),
    ...override,
  };
}

const build = (t: ThemeDef, mode: Mode): Theme => ({
  no: t.no,
  name: t.name,
  mode,
  palette: t.palette,
  schemes: Object.fromEntries(
    SECTION_ORDER.map((id) => [id, resolveScheme(mode === 'dark' ? darkColors(t, id) : t.sections[id])]),
  ) as Record<SectionId, Scheme>,
});

const resolved: Record<Mode, Theme[]> = {
  light: themes.map((t) => build(t, 'light')),
  dark: themes.map((t) => build(t, 'dark')),
};

export function getTheme(no: number, mode: Mode = 'light'): Theme {
  const list = resolved[mode];
  return list.find((t) => t.no === no) ?? list.find((t) => t.no === ACTIVE_THEME) ?? list[0];
}

/* ---------- CSS variables ---------- */

function schemeVars(s: Scheme): Record<string, string> {
  return {
    '--bg': s.bg, '--bg-alt': s.bgAlt, '--text': s.text, '--text-muted': s.textMuted,
    '--surface': s.surface, '--border': s.border, '--accent': s.accent, '--accent-ink': s.accentInk,
    '--glow': s.glow, '--particle': s.particle, '--cloud-a': s.cloudA, '--cloud-b': s.cloudB,
  };
}

/** CSS variables for one section, including the previous section's background for blended seams. */
export function sectionStyle(theme: Theme, id: SectionId): CSSProperties {
  const index = SECTION_ORDER.indexOf(id);
  const prev = theme.schemes[SECTION_ORDER[Math.max(0, index - 1)]];
  return { ...schemeVars(theme.schemes[id]), '--prev-bg': prev.bg } as CSSProperties;
}

export function rootStyle(theme: Theme): CSSProperties {
  const base = theme.schemes.identity;
  return {
    ...schemeVars(base),
    '--paper': base.bg,
    '--ink': base.text,
    '--font-display': FONTS.display,
    '--font-body': FONTS.body,
  } as CSSProperties;
}

/* ---------- React ---------- */

export const ThemeContext = createContext<Theme>(getTheme(ACTIVE_THEME));
export const useTheme = () => use(ThemeContext);
