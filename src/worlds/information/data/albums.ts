import type { Album, Photo } from '../types';

// Album mapping P-09 CONFIRMED by the Lead (2026-11-15); the source-folder mapping is recorded in
// docs/modules/information.md (Missing assets/data).
// Photos added at the Lead's request (2026-11-15). CORE-03 does not exist yet, so they were produced
// by a stopgap: each source was decoded and re-encoded to WebP through a canvas, then reduced to a
// bare VP8 bitstream, so no EXIF/GPS/XMP/ICC data survives. See src/assets/CREDITS.md.
// Shoot dates supplied by the creator (Lead, 2026-11-15).
// Life Moments shows the year only: its day and month are private (see module doc).

const urls = import.meta.glob<string>('../assets/photos/*/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

type Shape = 'p' | 'l';

/** Optimized photos `<album>-NN.webp` (2048 px long edge) and `-thumb.webp` (1024 px). */
function photos(albumId: string, items: [Shape, string][]): Photo[] {
  return items.map(([shape, alt], i) => {
    const n = String(i + 1).padStart(2, '0');
    const base = `../assets/photos/${albumId}/${albumId}-${n}`;
    return {
      id: `${albumId}-${n}`,
      alt,
      width: shape === 'p' ? 1365 : 2048,
      height: shape === 'p' ? 2048 : 1365,
      src: urls[`${base}.webp`],
      thumb: urls[`${base}-thumb.webp`],
    };
  });
}

export const albums: Album[] = [
  {
    id: 'studio',
    title: 'Studio Photography',
    date: { iso: '2026-06-06', label: '6 June 2026' },
    photos: photos('studio', [
      ['p', 'Seated in white flowing robes beside a lattice screen, holding a small cup'],
      ['l', 'Holding a blue folding fan beside a low tea table with a clay teapot and white blossoms'],
      ['p', 'Pouring tea from a clay teapot at a low wooden tea table'],
      ['p', 'Reclining in white robes against the tea table, looking at the camera'],
      ['p', 'Reading a thread-bound book under a paper parasol'],
      ['l', 'Leaning on the tea table, hand at the chin, white blossoms behind'],
      ['p', 'Hand at the chin beside the tea table, gazing to the side'],
      ['l', 'Reclining with an open thread-bound book beside a painted parasol'],
    ]),
  },
  {
    id: 'cosplay',
    title: 'Cosplay Collection',
    date: { iso: '2025-12-28', label: '28 December 2025' },
    photos: photos('cosplay', [
      ['p', 'Full-length portrait in a long black cloak in a park'],
      ['p', 'Close-up in black gloves, a silver chain held between the teeth'],
      ['p', 'Reaching toward the camera with a gloved hand wrapped in a silver chain'],
    ]),
  },
  {
    id: 'life',
    title: 'Life Moments',
    date: { iso: '2024', label: '2024' },
    photos: photos('life', [
      ['p', 'In a white suit beside a black cake crowned with a silver tiara'],
      ['p', 'Seated at a candlelit table, one hand across the face'],
      ['p', 'Looking down at a tiara-topped cake among candles and red roses'],
      ['p', 'Standing behind a candlelit table with a tiara-topped cake'],
      ['p', 'Holding a vintage camera up to the eye at a candlelit table'],
    ]),
  },
];
