import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PALETTES } from '@shared/settings';
import { BOARD_HALF, CENTER, project, RINGS, ringPoint } from './components/orbit';
import { idealRowHeight, justifyRows } from './components/rows';
import { cv } from './data/cv';
import { albums } from './data/albums';
import { identity } from './data/identity';
import meta from './meta';
import { milestones } from './data/journey';
import { fields } from './data/skills';
import { contrast, getTheme, SECTION_ORDER, type Mode } from './theme';
import { ACTIVE_THEME, PAIRED_THEMES, themes } from './theme.config';

const here = fileURLToPath(new URL('.', import.meta.url));

describe('theme', () => {
  const modes: Mode[] = ['light', 'dark'];
  const cases = modes.flatMap((mode) =>
    themes.flatMap((def) => {
      const t = getTheme(def.no, mode);
      return SECTION_ORDER.map((id) => [`${mode} ${t.no} ${t.name} · ${id}`, t.schemes[id]] as const);
    }),
  );

  it.each(cases)('%s keeps text at WCAG AA', (_, s) => {
    for (const bg of [s.bg, s.bgAlt]) {
      expect(contrast(s.text, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(s.textMuted, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(s.accentInk, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('numbers themes uniquely and resolves ACTIVE_THEME', () => {
    const numbers = themes.map((t) => t.no);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(numbers).toContain(ACTIVE_THEME);
    expect(getTheme(ACTIVE_THEME).no).toBe(ACTIVE_THEME);
  });

  it('keeps every written background and accent exactly as written', () => {
    for (const def of themes) {
      const t = getTheme(def.no, 'light');
      for (const id of SECTION_ORDER) {
        expect(t.schemes[id].bg).toBe(def.sections[id].bg);
        expect(t.schemes[id].accent).toBe(def.sections[id].accent);
      }
    }
  });

  it('dark mode turns every section dark and keeps written dark sections as they are', () => {
    for (const def of themes) {
      const t = getTheme(def.no, 'dark');
      for (const id of SECTION_ORDER) {
        expect(t.schemes[id].tone).toBe('dark');
        if (def.sections[id].tone === 'dark' && !def.dark?.[id]) {
          expect(t.schemes[id]).toEqual(getTheme(def.no, 'light').schemes[id]);
        }
      }
    }
  });

  it('every theme defines every section', () => {
    for (const t of themes) expect(Object.keys(t.sections).sort()).toEqual([...SECTION_ORDER].sort());
  });

  it('pairs every site palette with its own existing theme (P-16, P-17)', () => {
    const palettes = PALETTES;
    expect(Object.keys(PAIRED_THEMES).sort()).toEqual([...palettes].sort());
    const paired = palettes.map((p) => PAIRED_THEMES[p]);
    for (const no of paired) expect(themes.map((t) => t.no)).toContain(no);
    expect(new Set(paired).size).toBe(palettes.length);
    expect(ACTIVE_THEME).toBe(PAIRED_THEMES.iris); // the default site palette
  });
});

describe('content', () => {
  it('static meta matches the identity headline and the default theme accent', () => {
    expect(meta.tagline).toBe(identity.profile.headline);
    expect(meta.accent).toBe(getTheme(ACTIVE_THEME).schemes.identity.accent);
  });

  const raw = join(here, '../../../data/Information/mobius_identity_public.json');

  it.skipIf(!existsSync(raw))('identity matches the approved raw JSON apart from the Lead edit', () => {
    const expected = JSON.parse(readFileSync(raw, 'utf8'));
    const bio: string[] = expected.profile.bio.paragraphs;
    bio[3] = bio[3].replace(/^Möbius Universe là/, 'Đây là');
    expect(identity).toEqual(expected);
  });

  it('page shows no project brand name (Lead decision, 2026-11-15)', () => {
    expect(JSON.stringify(identity)).not.toMatch(/m[öo]bius/i);
  });

  it('skills come only from the confirmed professional fields', () => {
    expect(fields).toEqual([
      'Software Engineering',
      'Artificial Intelligence',
      'Cloud Computing',
      'Game Development',
    ]);
  });

  it('milestones run in order and only the last chapter is current', () => {
    const years = milestones.map((m) => Number(m.period.slice(0, 4)));
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(milestones.filter((m) => m.current).map((m) => m.id)).toEqual([milestones.at(-1)!.id]);
    for (const m of milestones) expect(m.description.length).toBeGreaterThan(0);
  });

  it('album dates are valid HTML date strings that agree with their labels', () => {
    for (const a of albums) {
      if (!a.date) continue;
      expect(a.date.iso).toMatch(/^(\d{4}(-\d{2}-\d{2})?|--\d{2}-\d{2})$/);
      const year = a.date.iso.match(/^\d{4}/)?.[0];
      if (year) expect(a.date.label).toContain(year);
      else expect(a.date.label).not.toMatch(/\d{4}/);
    }
  });

  it('unverified milestones and albums are flagged as placeholders', () => {
    for (const m of milestones) {
      if (m.placeholder) expect(m.title.toLowerCase()).toContain('pending');
    }
    for (const a of albums) {
      for (const p of a.photos) {
        // A photo without a source must be a placeholder; a real photo must not be.
        expect(Boolean(p.src)).toBe(!p.placeholder);
      }
    }
  });
});

describe('gallery layout', () => {
  it.each([1200, 900, 358])('every album fills whole rows in order at %ipx', (width) => {
    for (const a of albums) {
      const aspects = a.photos.map((p) => p.width / p.height);
      const rows = justifyRows(aspects, width, 24, idealRowHeight(width));
      expect(rows.flat()).toEqual(aspects.map((_, i) => i));
      for (const row of rows) expect(row.length).toBeGreaterThan(0);
    }
  });

  it('keeps row heights near the ideal instead of leaving a lone photo', () => {
    const p = 2 / 3;
    const l = 3 / 2;
    expect(justifyRows([p, p, p], 1200, 24, 480)).toEqual([[0, 1, 2]]);
    expect(justifyRows([p, l, p, p, p, l, p, l], 1200, 24, 480).map((r) => r.length)).toEqual([3, 3, 2]);
    expect(justifyRows([], 1200, 24, 480)).toEqual([]);
  });
});

describe('privacy', () => {
  it('Life Moments publishes the year only, never a day or month', () => {
    const life = albums.find((a) => a.id === 'life')!;
    expect(life.date?.iso ?? '').toMatch(/^(\d{4})?$/);
    expect(life.date?.label ?? '').toMatch(/^(\d{4})?$/);
  });

  function files(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? files(path) : [path];
    });
  }

  it('every real photo resolves both its full image and its thumbnail', () => {
    for (const a of albums) {
      for (const p of a.photos.filter((x) => !x.placeholder)) {
        expect(p.src, p.id).toMatch(/\.webp$/);
        expect(p.thumb, p.id).toMatch(/-thumb\.webp$/);
        expect(p.alt.length, p.id).toBeGreaterThan(10);
      }
    }
  });

  it('published photos carry no EXIF, XMP or ICC metadata', () => {
    const photos = files(join(here, 'assets')).filter((f) => !f.endsWith('.md'));
    expect(photos.length).toBeGreaterThan(0);
    for (const file of photos) {
      expect(file, file).toMatch(/\.webp$/);
      const b = readFileSync(file);
      expect(b.toString('ascii', 8, 12), file).toBe('WEBP');
      const chunks: string[] = [];
      for (let o = 12; o + 8 <= b.length; ) {
        const size = b.readUInt32LE(o + 4);
        chunks.push(b.toString('ascii', o, o + 4));
        o += 8 + size + (size % 2);
      }
      expect(chunks, file).toEqual(['VP8 ']);
    }
  });

  it('module source contains no birth date or phone number', () => {
    const self = fileURLToPath(import.meta.url);
    for (const file of files(here).filter((f) => /\.(tsx?|css|json|md)$/.test(f) && f !== self)) {
      const text = readFileSync(file, 'utf8');
      expect(text, file).not.toMatch(/birth|ngày sinh|dob/i);
      expect(text, file).not.toMatch(/(\+84|\b0)\d{2}[\s.-]?\d{3}[\s.-]?\d{3,4}\b/);
    }
  });
});

describe('orbit rings', () => {
  const angles = Array.from({ length: 3600 }, (_, i) => (i / 3600) * Math.PI * 2);

  it.each(RINGS.map((r, i) => [i, r] as const))('ring %i only crosses the portrait plane outside the board', (_, ring) => {
    for (const roll of [ring.roll - 0.05, ring.roll, ring.roll + 0.05]) {
      for (const a of angles) {
        const p = ringPoint(ring, a, roll);
        if (Math.abs(p.z) > 2) continue;
        expect(Math.abs(p.x) > BOARD_HALF.x || Math.abs(p.y) > BOARD_HALF.y).toBe(true);
      }
    }
  });

  it('rings cross each other and pass both in front of and behind the board', () => {
    const [a, b] = RINGS;
    expect(Math.sign(a.roll)).toBe(-Math.sign(b.roll));
    for (const ring of RINGS) {
      const zs = angles.map((t) => ringPoint(ring, t).z);
      expect(Math.max(...zs)).toBeGreaterThan(0);
      expect(Math.min(...zs)).toBeLessThan(0);
    }
  });

  it('projection is flat at rest and nearer points scale up', () => {
    const flat = project({ x: 10, y: -20, z: 0 }, 0, 0, 1000);
    expect(flat).toEqual({ x: CENTER.x + 10, y: CENTER.y - 20, s: 1 });
    expect(project({ x: 0, y: 0, z: 50 }, 0, 0, 1000).s).toBeGreaterThan(1);
  });
});

describe('public CV', () => {
  it('carries no phone field and links no file', () => {
    const text = JSON.stringify(cv);
    expect(text).not.toMatch(/phone|\.pdf|\.docx?/i);
    expect(cv.contact.map((c) => c.label)).toEqual(['Email', 'GitHub', 'Location']);
  });
});
