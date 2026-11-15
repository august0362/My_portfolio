import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WORLD_IDS as CONTRACT_IDS } from '../src/shared/contract';
import {
  checkImages,
  exifHasGps,
  findMetadata,
  optimizeImages,
  outputDir,
  parseArgs,
  toKebabName,
  webpChunks,
  WORLD_IDS,
} from './optimize-images.mjs';

/** A camera-like JPEG: EXIF with capture date and GPS, an ICC profile, rotated by EXIF orientation. */
async function cameraJpeg(width = 2400, height = 1600) {
  return sharp({ create: { width, height, channels: 3, background: '#a05a3c' } })
    .withIccProfile('p3')
    .withExif({
      IFD0: { Make: 'TestCam', Model: 'T-1', Copyright: 'Private Person' },
      IFD2: { DateTimeOriginal: '2024:05:06 07:08:09' },
      IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '21/1 1/1 30/1', GPSLongitudeRef: 'E', GPSLongitude: '105/1 51/1 0/1' },
    })
    .jpeg()
    .toBuffer();
}

describe('naming', () => {
  it('builds ASCII kebab-case names, including Vietnamese', () => {
    expect(toKebabName('Tiên hiệp 01')).toBe('tien-hiep-01');
    expect(toKebabName('Đà Lạt__Sunset (2)')).toBe('da-lat-sunset-2');
    expect(toKebabName('IMG_2034')).toBe('img-2034');
    expect(() => toKebabName('…')).toThrow(/--name/);
  });

  it('keeps the world list in sync with the frozen contract', () => {
    expect(WORLD_IDS).toEqual([...CONTRACT_IDS]);
  });

  it('only writes inside src/worlds/<id>/assets', () => {
    const root = join(tmpdir(), 'repo');
    expect(outputDir(root, 'information', 'albums/studio')).toBe(join(root, 'src', 'worlds', 'information', 'assets', 'albums', 'studio'));
    expect(() => outputDir(root, 'hub')).toThrow(/--world/);
    expect(() => outputDir(root, 'information', '../../core')).toThrow(/inside/);
    expect(() => outputDir(root, 'information', 'Albums')).toThrow(/kebab/);
  });

  it('parses the command line', () => {
    expect(parseArgs(['--world', 'information', '--name', 'studio', 'a.jpg', '--force'])).toMatchObject({
      world: 'information',
      name: 'studio',
      force: true,
      inputs: ['a.jpg'],
    });
    expect(() => parseArgs(['--world'])).toThrow(/needs a value/);
    expect(() => parseArgs(['--quality', '90'])).toThrow(/Unknown option/);
  });
});

describe('optimizeImages', () => {
  let root;
  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'optimize-images-'));
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it('detects the metadata a camera photo carries', async () => {
    const found = await findMetadata(await cameraJpeg());
    expect(found).toEqual(expect.arrayContaining(['EXIF (GPS)', 'ICC']));
  });

  it('writes a full WebP and a thumbnail with no metadata at all', async () => {
    const src = join(root, 'Tiên hiệp 01.jpg');
    await writeFile(src, await cameraJpeg());
    const [row] = await optimizeImages({ world: 'information', dir: 'albums', inputs: [src], root });

    expect(row.stripped).toEqual(expect.arrayContaining(['EXIF (GPS)', 'ICC']));
    expect(row.full).toMatchObject({ width: 1920, height: 1280 });
    expect(row.thumb).toMatchObject({ width: 480, height: 320 });

    const dir = join(root, 'src', 'worlds', 'information', 'assets', 'albums');
    expect((await readdir(dir)).sort()).toEqual(['tien-hiep-01-thumb.webp', 'tien-hiep-01.webp']);
    for (const file of ['tien-hiep-01.webp', 'tien-hiep-01-thumb.webp']) {
      const buf = await readFile(join(dir, file));
      expect(await findMetadata(buf)).toEqual([]);
      expect(webpChunks(buf)).not.toEqual(expect.arrayContaining(['EXIF', 'XMP ', 'ICCP']));
      // No trace of the private fields in the bytes either.
      for (const needle of ['TestCam', 'Private Person', '2024:05:06', 'Exif']) expect(buf.includes(needle)).toBe(false);
    }
  });

  it('never enlarges small images and numbers files with --name', async () => {
    const small = await sharp({ create: { width: 300, height: 400, channels: 3, background: '#335' } }).png().toBuffer();
    await writeFile(join(root, 'b.png'), small);
    await writeFile(join(root, 'a.png'), small);
    const rows = await optimizeImages({ world: 'production', name: 'Studio Shots', inputs: [root], root });
    expect(rows.map((r) => r.full.path.replaceAll('\\', '/'))).toEqual([
      'src/worlds/production/assets/studio-shots-01.webp',
      'src/worlds/production/assets/studio-shots-02.webp',
    ]);
    expect(rows[0].full).toMatchObject({ width: 300, height: 400 });
    expect(rows[0].thumb).toMatchObject({ width: 300, height: 400 });
  });

  it('refuses to overwrite or to write colliding names', async () => {
    const src = join(root, 'photo.jpg');
    await writeFile(src, await cameraJpeg(800, 600));
    await optimizeImages({ world: 'character', inputs: [src], root });
    await expect(optimizeImages({ world: 'character', inputs: [src], root })).rejects.toThrow(/--force/);
    await expect(optimizeImages({ world: 'character', inputs: [src], root, force: true })).resolves.toHaveLength(1);

    await writeFile(join(root, 'Photo!.jpg'), await cameraJpeg(800, 600));
    await expect(optimizeImages({ world: 'ethereal', inputs: [src, join(root, 'Photo!.jpg')], root })).rejects.toThrow(/collision/);
  });
});

describe('check mode', () => {
  it('flags a WebP that still carries metadata', async () => {
    const root = await mkdtemp(join(tmpdir(), 'optimize-images-check-'));
    try {
      const dirty = await sharp(await cameraJpeg(640, 480)).keepMetadata().webp().toBuffer();
      const clean = await sharp(await cameraJpeg(640, 480)).webp().toBuffer();
      await writeFile(join(root, 'dirty.webp'), dirty);
      await writeFile(join(root, 'clean.webp'), clean);
      const rows = await checkImages([root]);
      expect(rows.map((r) => [r.file.endsWith('clean.webp') ? 'clean' : 'dirty', r.found.length > 0])).toEqual([
        ['clean', false],
        ['dirty', true],
      ]);
      expect(exifHasGps((await sharp(dirty).metadata()).exif)).toBe(true);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
