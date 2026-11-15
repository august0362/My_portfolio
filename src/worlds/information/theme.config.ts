import type { Settings } from '@shared/settings';
import type { ThemeDef } from './theme';

/* ══════════════════════════════════════════════════════════════════════════
   CHRONICLE · COLOR CONFIG   (the only file you need to edit for colors)

   1. PAIRED_THEMES      the Chronicle theme shown for each site palette. Visitors pick
                         the palette and light/dark in the site's Atmosphere panel, so
                         every page stays in one color story (P-16). Point a palette at
                         any theme number below to re-pair it.
   2. ACTIVE_THEME       fallback theme; it is the one paired with the default palette.
   3. THEMES             edit any hex value; save and the page updates. Each theme uses only the colors
                         of one moodboard in data/Image/Theme (P-17).

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
  iris: 1, // Iris Reverie: f996cc3f2a1f556469bc6e165d8d476f.jpg
  sakura: 2, // Sakura Rose: bf9369d6ef4568bb9d20c610b23d6163.jpg
  jade: 3, // Jade Silk: 4c65dc070bc7af2bf5ef456285cb80ba.jpg
  pearl: 4, // Pearl Sheen: 417300860fc91c1ac899b0bf28bb66b3.jpg
  dream: 5, // Dream Haze: 7a23aac0d5b3974c2c3e7331746eca5e.jpg
};
export const ACTIVE_THEME = PAIRED_THEMES.iris;

export const FONTS = {
  display: "'Cormorant Garamond', 'Cormorant', 'Times New Roman', serif",
  body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
};

export const themes: ThemeDef[] = [
  /* ── 01 · Iris Reverie ── only the colors of f996cc3f2a1f556469bc6e165d8d476f.jpg. */
  {
    no: 1,
    name: 'Iris Reverie',
    palette: ['#c7c6df',  '#8d91b5',  '#6f6d97',  '#383b67'],
    sections: {
      identity: { tone: 'light', bg: '#f5f5f9', text: '#383b67', accent: '#8d91b5', accentInk: '#636186', particle: '#6f6d97', cloudA: '#e0e0ed', cloudB: '#c0c2d6', glow: '#d8d7e9' },
      journey: { tone: 'dark', bg: '#191b2e', text: '#f4f4f9', accent: '#cdcce2', particle: '#ddddec', cloudA: '#6f6d97', cloudB: '#8d91b5', glow: '#8d91b5' },
      gallery: { tone: 'light', bg: '#f7f7fb', text: '#383b67', accent: '#6f6d97', particle: '#ffffff', cloudA: '#bbbdd3', cloudB: '#d8d7e9', glow: '#e3e2ef' },
      skills: { tone: 'light', bg: '#f1f2f6', text: '#383b67', accent: '#c7c6df', particle: '#6f6d97', cloudA: '#ddddec', cloudB: '#d8d7e9' },
      connect: { tone: 'dark', bg: '#25263d', text: '#f7f6fa', accent: '#cdcce2', particle: '#ddddec', cloudA: '#6f6d97', cloudB: '#383b67', glow: '#8d91b5' },
    },
  },

  /* ── 02 · Sakura Rose ── only the colors of bf9369d6ef4568bb9d20c610b23d6163.jpg. */
  {
    no: 2,
    name: 'Sakura Rose',
    palette: ['#a77370',  '#c87377',  '#d38f8f',  '#eeadaa',  '#fdd4d7',  '#fee3e5'],
    sections: {
      identity: { tone: 'light', bg: '#fffafa', text: '#704d4b', accent: '#d38f8f', accentInk: '#9c5a5d', particle: '#c87377', cloudA: '#f6d2d0', cloudB: '#e7c1c1', glow: '#f3c6c4' },
      journey: { tone: 'dark', bg: '#1c1413', text: '#fff9fa', accent: '#f0b5b2', particle: '#feeeef', cloudA: '#c87377', cloudB: '#d38f8f', glow: '#d38f8f' },
      gallery: { tone: 'light', bg: '#fdf4f3', text: '#6d4b49', accent: '#c87377', particle: '#ffffff', cloudA: '#e5bcbc', cloudB: '#feebed', glow: '#f6d6d4' },
      skills: { tone: 'light', bg: '#faf2f2', text: '#6b4a48', accent: '#eeadaa', particle: '#c87377', cloudA: '#f5cecc', cloudB: '#feebed' },
      connect: { tone: 'dark', bg: '#342121', text: '#fffbfb', accent: '#f0b5b2', particle: '#feeeef', cloudA: '#c87377', cloudB: '#a77370', glow: '#d38f8f' },
    },
  },

  /* ── 03 · Jade Silk ── only the colors of 4c65dc070bc7af2bf5ef456285cb80ba.jpg. */
  {
    no: 3,
    name: 'Jade Silk',
    palette: ['#0d3021',  '#406250',  '#688777',  '#8aaca0',  '#bedbd3'],
    sections: {
      identity: { tone: 'light', bg: '#f3f9f7', text: '#0d3021', accent: '#688777', accentInk: '#406250', particle: '#406250', cloudA: '#bfd1cb', cloudB: '#acbdb4', glow: '#adc5bc' },
      journey: { tone: 'dark', bg: '#092217', text: '#f2f8f6', accent: '#96b4aa', particle: '#d8e9e5', cloudA: '#406250', cloudB: '#688777', glow: '#688777' },
      gallery: { tone: 'light', bg: '#eff3f2', text: '#0d3021', accent: '#406250', particle: '#ffffff', cloudA: '#a4b7ad', cloudB: '#d2e6e0', glow: '#c4d6d0' },
      skills: { tone: 'light', bg: '#edf1ef', text: '#0d3021', accent: '#8aaca0', particle: '#406250', cloudA: '#b9cdc6', cloudB: '#d2e6e0' },
      connect: { tone: 'dark', bg: '#112b1f', text: '#f5faf8', accent: '#96b4aa', particle: '#d8e9e5', cloudA: '#406250', cloudB: '#0d3021', glow: '#688777' },
    },
  },

  /* ── 04 · Pearl Sheen ── only the colors of 417300860fc91c1ac899b0bf28bb66b3.jpg. */
  {
    no: 4,
    name: 'Pearl Sheen',
    palette: ['#af9292',  '#bcaec4',  '#b7937a',  '#c8b5a9',  '#e6dedd'],
    sections: {
      identity: { tone: 'light', bg: '#faf9f9', text: '#625252', accent: '#bcaec4', accentInk: '#7e6554', particle: '#b7937a', cloudA: '#e1d6d0', cloudB: '#dad2df', glow: '#d8cbc3' },
      journey: { tone: 'dark', bg: '#1a1616', text: '#faf8f8', accent: '#cebcb2', particle: '#f0ebeb', cloudA: '#b7937a', cloudB: '#bcaec4', glow: '#bcaec4' },
      gallery: { tone: 'light', bg: '#f7f5f3', text: '#5e4f4f', accent: '#b7937a', particle: '#ffffff', cloudA: '#d7cedc', cloudB: '#eee8e7', glow: '#e4dad4' },
      skills: { tone: 'light', bg: '#f7f5f8', text: '#605050', accent: '#c8b5a9', particle: '#b7937a', cloudA: '#ded3cb', cloudB: '#eee8e7' },
      connect: { tone: 'dark', bg: '#302824', text: '#fbfafa', accent: '#cebcb2', particle: '#f0ebeb', cloudA: '#b7937a', cloudB: '#af9292', glow: '#bcaec4' },
    },
  },

  /* ── 05 · Dream Haze ── only the colors of 7a23aac0d5b3974c2c3e7331746eca5e.jpg. */
  {
    no: 5,
    name: 'Dream Haze',
    palette: ['#7181c8',  '#ababdc',  '#b7d3f4',  '#f1cfed',  '#f1e5f6'],
    sections: {
      identity: { tone: 'light', bg: '#fcfafd', text: '#495482', accent: '#b7d3f4', accentInk: '#6a6a88', particle: '#ababdc', cloudA: '#f7e5f5', cloudB: '#d7e7f9', glow: '#f5ddf2' },
      journey: { tone: 'dark', bg: '#171a28', text: '#fcfafd', accent: '#f2d4ef', particle: '#f7effa', cloudA: '#ababdc', cloudB: '#b7d3f4', glow: '#b7d3f4' },
      gallery: { tone: 'light', bg: '#fdf8fc', text: '#485380', accent: '#ababdc', particle: '#ffffff', cloudA: '#d4e5f8', cloudB: '#f5edf9', glow: '#f8e7f6' },
      skills: { tone: 'light', bg: '#f6fafe', text: '#485380', accent: '#f1cfed', particle: '#ababdc', cloudA: '#f7e2f4', cloudB: '#f5edf9' },
      connect: { tone: 'dark', bg: '#2c2e41', text: '#fdfbfe', accent: '#f2d4ef', particle: '#f7effa', cloudA: '#ababdc', cloudB: '#7181c8', glow: '#b7d3f4' },
    },
  },
];
