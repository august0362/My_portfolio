import type { Settings } from '@shared/settings';
import type { ThemeDef } from './theme';

/* ══════════════════════════════════════════════════════════════════════════
   CHRONICLE · COLOR CONFIG   (the only file you need to edit for colors)

   1. PAIRED_THEMES      the Chronicle theme shown for each site palette. Visitors pick
                         the palette and light/dark in the site's Atmosphere panel, so
                         every page stays in one color story (P-16). Point a palette at
                         any theme number below to re-pair it.
   2. ACTIVE_THEME       fallback theme; it is the one paired with the default palette.
   3. THEMES             edit any hex value; save and the page updates.

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
  moonlit: 1, // Chronicle: moonlit navy and lavender
  rosewater: 2, // Cotton Sky: pink cloud and orchid
  tidal: 3, // Muted Summer: misty aqua and sage
};
export const ACTIVE_THEME = PAIRED_THEMES.moonlit;

export const FONTS = {
  display: "'Cormorant Garamond', 'Cormorant', 'Times New Roman', serif",
  body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
};

export const themes: ThemeDef[] = [
  /* ── 01 · Chronicle ── Moonlit Reverie · Angel's Breath · Sunset Clouds · Pastel Dream.
     The original, hand-tuned theme: every value is set explicitly. */
  {
    no: 1,
    name: 'Chronicle',
    palette: ['#344979', '#c6c6e8', '#f7e5eb', '#ecb8a6', '#fcd6c1', '#d6b0bf', '#d2c296', '#bdd1d3'],
    sections: {
      identity: {
        tone: 'light', bg: '#faf3ee', bgAlt: '#ede0dc', text: '#26355c', textMuted: '#5a5470',
        surface: '#ffffff8c', border: '#3449792e', accent: '#ecb8a6', accentInk: '#344979',
        glow: '#fcd6c1', particle: '#ecb8a6', cloudA: '#fcd6c1', cloudB: '#c6c6e8',
      },
      journey: {
        tone: 'dark', bg: '#18213b', bgAlt: '#344979', text: '#f7e5eb', textMuted: '#c6c6e8',
        surface: '#ffffff0d', border: '#c6c6e833', accent: '#c6c6e8', accentInk: '#f7e5eb',
        glow: '#9896bb', particle: '#f7e5eb', cloudA: '#5d6da5', cloudB: '#ae9cb7',
      },
      gallery: {
        tone: 'light', bg: '#fdf1ec', bgAlt: '#fbd8c6', text: '#4a3a55', textMuted: '#634f68',
        surface: '#ffffff73', border: '#4a3a552b', accent: '#d6b0bf', accentInk: '#4a3a55',
        glow: '#f4c4c3', particle: '#ffffff', cloudA: '#f4c4c3', cloudB: '#ae9cb7',
      },
      skills: {
        tone: 'light', bg: '#f3f1e9', bgAlt: '#e0decd', text: '#2f3546', textMuted: '#555a69',
        surface: '#ffffff80', border: '#2f35462b', accent: '#d2c296', accentInk: '#2f3546',
        glow: '#d2c296', particle: '#d2c296', cloudA: '#bdd1d3', cloudB: '#d2c296',
      },
      connect: {
        tone: 'dark', bg: '#2b3c68', bgAlt: '#344979', text: '#f7e5eb', textMuted: '#c6c6e8',
        surface: '#ffffff12', border: '#f7e5eb33', accent: '#d6b0bf', accentInk: '#f7e5eb',
        glow: '#d6b0bf', particle: '#f7e5eb', cloudA: '#d6b0bf', cloudB: '#5d6da5',
      },
    },
  },

  /* ── 02 · Cotton Sky ── pink cloud, orchid, lavender, periwinkle, sky, mist. */
  {
    no: 2,
    name: 'Cotton Sky',
    palette: ['#fbd8e0', '#cf90c1', '#8d80b0', '#8397c4', '#aacbe0', '#dde9ef'],
    sections: {
      identity: { tone: 'light', bg: '#fdf3f6', text: '#33305a', accent: '#cf90c1', particle: '#cf90c1', cloudA: '#fbd8e0', cloudB: '#aacbe0' },
      journey: { tone: 'dark', bg: '#262a52', text: '#f4eef6', accent: '#aacbe0', particle: '#fbd8e0', cloudA: '#8d80b0', cloudB: '#cf90c1', glow: '#8397c4' },
      gallery: { tone: 'light', bg: '#f0f5f9', text: '#2d3760', accent: '#8397c4', particle: '#ffffff', cloudA: '#aacbe0', cloudB: '#fbd8e0', glow: '#dde9ef' },
      skills: { tone: 'light', bg: '#f8f1f6', text: '#3b3159', accent: '#8d80b0', particle: '#cf90c1', cloudA: '#fbd8e0', cloudB: '#dde9ef' },
      connect: { tone: 'dark', bg: '#3a3060', text: '#fdf0f4', accent: '#cf90c1', particle: '#fbd8e0', cloudA: '#cf90c1', cloudB: '#8397c4' },
    },
  },

  /* ── 03 · Muted Summer ── misty aqua, sage, sunset apricot, faded almond, cloud white. */
  {
    no: 3,
    name: 'Muted Summer',
    palette: ['#96b9b9', '#b3beaf', '#e4a273', '#c3a77f', '#dddfdb'],
    sections: {
      identity: { tone: 'light', bg: '#f6f3ee', text: '#2c4343', accent: '#e4a273', particle: '#e4a273', cloudA: '#f3d6be', cloudB: '#c9dddd' },
      journey: { tone: 'dark', bg: '#1f3436', text: '#f3efe6', accent: '#96b9b9', particle: '#f2c9a3', cloudA: '#5f8a8a', cloudB: '#a07e5a', glow: '#96b9b9' },
      gallery: { tone: 'light', bg: '#f2f4f0', text: '#2f3f3c', accent: '#96b9b9', particle: '#ffffff', cloudA: '#c9dcdc', cloudB: '#f2cfb3', glow: '#dddfdb' },
      skills: { tone: 'light', bg: '#f7f1e7', text: '#47392a', accent: '#c3a77f', particle: '#e4a273', cloudA: '#b3beaf', cloudB: '#ecd5b4', glow: '#e9c9a4' },
      connect: { tone: 'dark', bg: '#3b2e27', text: '#f8eee4', accent: '#e4a273', particle: '#f6d2b0', cloudA: '#a8714a', cloudB: '#5f8a8a', glow: '#e4a273' },
    },
  },

  /* ── 04 · Northern Quiet ── shadow navy, misty indigo, soft graphite, warm wood. */
  {
    no: 4,
    name: 'Northern Quiet',
    palette: ['#0b2b51', '#3c4d70', '#7a7b8f', '#807073', '#c5a8a1'],
    sections: {
      identity: { tone: 'light', bg: '#f6f0ed', text: '#0b2b51', accent: '#c5a8a1', particle: '#c5a8a1', cloudA: '#ead9d3', cloudB: '#cfd4e0' },
      journey: { tone: 'dark', bg: '#0b2b51', text: '#f3ebe8', accent: '#c5a8a1', particle: '#f0dfd9', cloudA: '#3c4d70', cloudB: '#807073', glow: '#7a7b8f' },
      gallery: { tone: 'light', bg: '#f1eff1', text: '#26334f', accent: '#7a7b8f', particle: '#ffffff', cloudA: '#e3d3cf', cloudB: '#cdd2df', glow: '#c5a8a1' },
      skills: { tone: 'light', bg: '#f4ece8', text: '#3b2f32', accent: '#807073', particle: '#c5a8a1', cloudA: '#e6d2cb', cloudB: '#d5d8e2', glow: '#c5a8a1' },
      connect: { tone: 'dark', bg: '#28344f', text: '#f6ece8', accent: '#c5a8a1', particle: '#f0dfd9', cloudA: '#807073', cloudB: '#3c4d70', glow: '#c5a8a1' },
    },
  },

  /* ── 05 · Nocturne Violet ── shadow black, iris blue, foggy purple, cloud violet. Night-heavy. */
  {
    no: 5,
    name: 'Nocturne Violet',
    palette: ['#000002', '#252c5c', '#2f357e', '#7978ba', '#cbc9e7'],
    sections: {
      identity: { tone: 'light', bg: '#f1f0f9', text: '#1f2552', accent: '#7978ba', particle: '#7978ba', cloudA: '#cbc9e7', cloudB: '#dcdcf2' },
      journey: { tone: 'dark', bg: '#0b0d24', text: '#eceaf8', accent: '#7978ba', particle: '#cbc9e7', cloudA: '#2f357e', cloudB: '#7978ba', glow: '#7978ba' },
      gallery: { tone: 'dark', bg: '#1a1f4a', text: '#efeefa', accent: '#cbc9e7', particle: '#cbc9e7', cloudA: '#2f357e', cloudB: '#7978ba', glow: '#7978ba' },
      skills: { tone: 'light', bg: '#eceaf6', text: '#252c5c', accent: '#7978ba', particle: '#7978ba', cloudA: '#cbc9e7', cloudB: '#d9dcf0' },
      connect: { tone: 'dark', bg: '#05061a', text: '#e9e7f7', accent: '#7978ba', particle: '#cbc9e7', cloudA: '#2f357e', cloudB: '#252c5c', glow: '#7978ba' },
    },
  },

  /* ── 06 · Dream Prism ── deep grape, violet ice, pale iris, cloud mist. */
  {
    no: 6,
    name: 'Dream Prism',
    palette: ['#2b388d', '#6465bb', '#8f6ad1', '#8f99d6', '#d9e0e9'],
    sections: {
      identity: { tone: 'light', bg: '#f0f2f8', text: '#1f2a6e', accent: '#8f6ad1', particle: '#8f99d6', cloudA: '#ddd2f4', cloudB: '#d9e0e9', glow: '#cfd5f2' },
      journey: { tone: 'dark', bg: '#1c2463', text: '#eef0fb', accent: '#8f99d6', particle: '#d9cdf5', cloudA: '#6465bb', cloudB: '#8f6ad1', glow: '#8f99d6' },
      gallery: { tone: 'light', bg: '#f3f1fb', text: '#2a2d6b', accent: '#6465bb', particle: '#ffffff', cloudA: '#d9e0e9', cloudB: '#e0d3f6', glow: '#c9c0ef' },
      skills: { tone: 'light', bg: '#edf0f8', text: '#22306e', accent: '#8f99d6', particle: '#8f6ad1', cloudA: '#d9e0e9', cloudB: '#e3d8f6' },
      connect: { tone: 'dark', bg: '#2e2470', text: '#f4effd', accent: '#b79cec', particle: '#e4dafa', cloudA: '#8f6ad1', cloudB: '#2b388d', glow: '#8f6ad1' },
    },
  },
];
