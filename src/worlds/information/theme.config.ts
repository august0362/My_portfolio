import type { Settings } from '@shared/settings';
import type { ThemeDef } from './theme';

/* ══════════════════════════════════════════════════════════════════════════
   CHRONICLE · COLOR CONFIG   (the only file you need to edit for colors)

   1. PAIRED_THEMES      the Chronicle theme shown for each site palette. Visitors pick
                         the palette and light/dark in the site's Atmosphere panel, so
                         every page stays in one color story (P-16). Point a palette at
                         any theme number below to re-pair it.
   2. ACTIVE_THEME       fallback theme; it is the one paired with the default palette.
   3. THEMES             edit any hex value; save and the page updates. The five themes
                         come from the owner's moodboards in data/Image/Theme (P-17).

   Each section needs:  tone ('light' | 'dark'), bg, text, accent, particle, cloudA, cloudB.
   Optional overrides:  bgAlt, textMuted, accentInk, surface, border, glow.
   Omitted values are derived, and text colors are nudged automatically
   until they meet WCAG AA contrast, so any color choice stays readable.

   Sections:  identity (hero) · journey (timeline) · gallery (photos)
              skills · connect (contacts + footer)
   Dark mode is derived automatically from each theme. To fine-tune it, add
   `dark: { identity: { bg: '#...', text: '#...' } }` to a theme (any section, any field).
   New theme: copy a block, give it the next `no`.
   ══════════════════════════════════════════════════════════════════════════ */

export const PAIRED_THEMES: Record<Settings['palette'], number> = {
  iris: 1, // Iris Reverie: iris petals, jacaranda and lavender
  sakura: 2, // Sakura Haze: cherry blossom, dusty rose and dream sky
  jade: 3, // Jade Silk: forest jade and silver mint
  pearl: 4, // Pearl Dew: iridescent pearl, peach rose and ivory
  lagoon: 5, // Pink Lagoon: veranda blue, lychee and melon pink
};
export const ACTIVE_THEME = PAIRED_THEMES.iris;

export const FONTS = {
  display: "'Cormorant Garamond', 'Cormorant', 'Times New Roman', serif",
  body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
};

export const themes: ThemeDef[] = [
  /* ── 01 · Iris Reverie ── iris mist, periwinkle, lavender field, jacaranda sky. */
  {
    no: 1,
    name: 'Iris Reverie',
    palette: ['#383b67', '#6f6d97', '#8d91b5', '#c7c6df', '#bacbfe', '#efe2fa', '#7164b4', '#78acc1'],
    sections: {
      identity: { tone: 'light', bg: '#f5f3fb', text: '#2c2f5c', accent: '#bca5d4', accentInk: '#4b4a86', particle: '#8f9fe4', cloudA: '#efe2fa', cloudB: '#bacbfe', glow: '#dcd3f3' },
      journey: { tone: 'dark', bg: '#1d1f42', text: '#f1eefa', accent: '#bacbfe', particle: '#efe2fa', cloudA: '#6f6d97', cloudB: '#7164b4', glow: '#8d91b5' },
      gallery: { tone: 'light', bg: '#f1f3fa', text: '#2f3460', accent: '#8488b5', particle: '#ffffff', cloudA: '#bcb9d8', cloudB: '#98bfd0', glow: '#dedeea' },
      skills: { tone: 'light', bg: '#f6f1fb', text: '#33305e', accent: '#bca5d4', particle: '#7164b4', cloudA: '#efe2fa', cloudB: '#c7c6df' },
      connect: { tone: 'dark', bg: '#262856', text: '#f3f0fb', accent: '#bacbfe', particle: '#efe2fa', cloudA: '#7164b4', cloudB: '#383b67', glow: '#8f9fe4' },
    },
  },

  /* ── 02 · Sakura Haze ── cherry blossom, dusty rose, rosewood, dream-sky periwinkle. */
  {
    no: 2,
    name: 'Sakura Haze',
    palette: ['#fee3ec', '#f4c9da', '#f5c4e2', '#eeadaa', '#d38f8f', '#c87377', '#a77370', '#b1bef2'],
    sections: {
      identity: { tone: 'light', bg: '#fff5f8', text: '#5a2f40', accent: '#f4c9da', accentInk: '#8e4a5c', particle: '#eeadaa', cloudA: '#fee3ec', cloudB: '#b1bef2', glow: '#fdd4d7' },
      journey: { tone: 'dark', bg: '#2e1b26', text: '#fff0f4', accent: '#f4c9da', particle: '#fee3ec', cloudA: '#a77370', cloudB: '#7181c8', glow: '#c87377' },
      gallery: { tone: 'light', bg: '#fdf2f5', text: '#4f2c3b', accent: '#d38f8f', particle: '#ffffff', cloudA: '#f5c4e2', cloudB: '#b7d3f4', glow: '#f1e5f6' },
      skills: { tone: 'light', bg: '#f9f1f7', text: '#4a2d45', accent: '#ababdc', particle: '#c87377', cloudA: '#f1cfed', cloudB: '#b1bef2' },
      connect: { tone: 'dark', bg: '#3a2230', text: '#fff1f4', accent: '#eeadaa', particle: '#fdd4d7', cloudA: '#c87377', cloudB: '#7181c8', glow: '#d38f8f' },
    },
  },

  /* ── 03 · Jade Silk ── forest jade, sage, silver mint. */
  {
    no: 3,
    name: 'Jade Silk',
    palette: ['#0d3021', '#406250', '#688777', '#8aaca0', '#bedbd3'],
    sections: {
      identity: { tone: 'light', bg: '#f2f8f5', text: '#123326', accent: '#8aaca0', accentInk: '#2f5242', particle: '#688777', cloudA: '#d6ebe3', cloudB: '#bedbd3', glow: '#cfe5dc' },
      journey: { tone: 'dark', bg: '#0d2a1f', text: '#eef7f2', accent: '#bedbd3', particle: '#d6ebe3', cloudA: '#406250', cloudB: '#688777', glow: '#8aaca0' },
      gallery: { tone: 'light', bg: '#f0f6f3', text: '#163a2c', accent: '#688777', particle: '#ffffff', cloudA: '#bedbd3', cloudB: '#e4efe9', glow: '#d9ebe3' },
      skills: { tone: 'light', bg: '#f5f7f2', text: '#1f3a2c', accent: '#8aaca0', particle: '#406250', cloudA: '#d6e8df', cloudB: '#bedbd3' },
      connect: { tone: 'dark', bg: '#123d2d', text: '#f0f8f4', accent: '#bedbd3', particle: '#e2f1eb', cloudA: '#688777', cloudB: '#0d3021', glow: '#8aaca0' },
    },
  },

  /* ── 04 · Pearl Dew ── iridescent pearl, lilac sheen, peach rose, ivory, warm taupe. */
  {
    no: 4,
    name: 'Pearl Dew',
    palette: ['#e6dedd', '#e9d8c6', '#ddbda5', '#c49b85', '#a37e66', '#8c7466', '#af9292', '#bcaec4'],
    sections: {
      identity: { tone: 'light', bg: '#faf6f2', text: '#43332c', accent: '#ddbda5', accentInk: '#7a5a49', particle: '#bcaec4', cloudA: '#e9d8c6', cloudB: '#e6dedd', glow: '#efe2d6' },
      journey: { tone: 'dark', bg: '#2b2220', text: '#f6eee9', accent: '#d4c4dc', particle: '#e9d8c6', cloudA: '#8c7466', cloudB: '#af9292', glow: '#bcaec4' },
      gallery: { tone: 'light', bg: '#f8f2ef', text: '#45322f', accent: '#af9292', particle: '#ffffff', cloudA: '#e6dedd', cloudB: '#dccfe2', glow: '#e8dcd6' },
      skills: { tone: 'light', bg: '#f7f2ec', text: '#47372d', accent: '#c49b85', particle: '#b7937a', cloudA: '#e9d8c6', cloudB: '#e2ddd4' },
      connect: { tone: 'dark', bg: '#362b29', text: '#f8f0eb', accent: '#ddbda5', particle: '#efe2d6', cloudA: '#a37e66', cloudB: '#bcaec4', glow: '#c49b85' },
    },
  },

  /* ── 05 · Pink Lagoon ── veranda blue, sky cloud, lychee, melon, cupid pink. */
  {
    no: 5,
    name: 'Pink Lagoon',
    palette: ['#6bb1ad', '#a7bcbd', '#edecdb', '#e5a9a9', '#e6748e'],
    sections: {
      identity: { tone: 'light', bg: '#f8f7ee', text: '#1d4446', accent: '#e5a9a9', accentInk: '#a3405e', particle: '#6bb1ad', cloudA: '#f5d6d6', cloudB: '#cfe4e2', glow: '#f1dcd4' },
      journey: { tone: 'dark', bg: '#0f2b2f', text: '#f5f6ec', accent: '#8fd0cb', particle: '#f5d0d4', cloudA: '#3d7f7b', cloudB: '#b8697b', glow: '#6bb1ad' },
      gallery: { tone: 'light', bg: '#f1f6f3', text: '#1f4446', accent: '#6bb1ad', particle: '#ffffff', cloudA: '#cfe4e2', cloudB: '#f6d9d9', glow: '#edecdb' },
      skills: { tone: 'light', bg: '#fbf4ef', text: '#4a2b33', accent: '#e6748e', particle: '#e5a9a9', cloudA: '#f8dede', cloudB: '#d6e6e4' },
      connect: { tone: 'dark', bg: '#173a3d', text: '#f6f5ec', accent: '#f0a9b4', particle: '#f8dfe2', cloudA: '#e6748e', cloudB: '#6bb1ad', glow: '#e5a9a9' },
    },
  },
];
