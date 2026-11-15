#!/usr/bin/env node
/**
 * optimize-images.mjs (CORE-03): turns raw photos into public, metadata-free WebP for a world.
 *
 * Usage
 *   npm run images -- --world <id> [--dir <sub/folder>] [--name <base>] [--force] <file|folder>...
 *   npm run images -- --check <file|folder>...
 *
 * Optimize mode (default)
 *   - Reads JPEG, PNG, WebP, AVIF, TIFF or GIF files. Folders are scanned recursively. Inputs are only
 *     read, never changed, so raw originals in `data/` stay untouched.
 *   - Writes two files per input to `src/worlds/<id>/assets[/<dir>]/`:
 *       <name>.webp        full size, long edge at most 1920 px (never enlarged)
 *       <name>-thumb.webp  thumbnail, long edge at most 480 px
 *   - Names are ASCII kebab-case from the source file name (Vietnamese diacritics removed), or
 *     `<base>-01`, `<base>-02`, ... in sorted input order when `--name` is given.
 *   - Strips ALL metadata: EXIF (camera, capture dates, GPS), XMP, IPTC and the ICC profile. Orientation
 *     is applied to the pixels first and colours are converted to sRGB, so nothing visible is lost.
 *   - Re-reads every output and fails (deleting what this run wrote) if any metadata is left.
 *   - Refuses to overwrite existing files unless `--force` is given.
 *
 * Check mode (`--check`)
 *   Verifies existing images carry no metadata (useful for QA-04). Exits 1 if any file fails.
 *
 * Output is printed as a table: source metadata found, output size and the verification result.
 */
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

/** Mirrors WORLD_IDS in src/shared/contract.ts (a test keeps them in sync). */
export const WORLD_IDS = ['information', 'production', 'character', 'wanderlight', 'ethereal'];
export const FULL_EDGE = 1920;
export const THUMB_EDGE = 480;
const FULL_QUALITY = 82;
const THUMB_QUALITY = 76;
const INPUT_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff', '.gif']);
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** ASCII kebab-case: "Tiên hiệp 01.JPG" -> "tien-hiep-01". */
export function toKebabName(name) {
  const kebab = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!kebab) throw new Error(`Cannot build an ASCII name from "${name}"; pass --name.`);
  return kebab;
}

/** Lists the RIFF chunk ids in a WebP file, e.g. ["VP8X", "VP8 "]. */
export function webpChunks(buf) {
  if (buf.length < 12 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Not a WebP file');
  }
  const chunks = [];
  for (let at = 12; at + 8 <= buf.length; ) {
    const size = buf.readUInt32LE(at + 4);
    chunks.push(buf.toString('ascii', at, at + 4));
    at += 8 + size + (size % 2);
  }
  return chunks;
}

/** True when an EXIF block (as returned by sharp) has a GPS IFD pointer in IFD0. */
export function exifHasGps(exif) {
  if (!exif || exif.length < 14) return false;
  const tiff = exif.toString('ascii', 0, 4) === 'Exif' ? 6 : 0;
  const order = exif.toString('ascii', tiff, tiff + 2);
  if (order !== 'II' && order !== 'MM') return false;
  const le = order === 'II';
  const u16 = (o) => (le ? exif.readUInt16LE(o) : exif.readUInt16BE(o));
  const u32 = (o) => (le ? exif.readUInt32LE(o) : exif.readUInt32BE(o));
  const ifd0 = tiff + u32(tiff + 4);
  if (ifd0 + 2 > exif.length) return false;
  const count = u16(ifd0);
  for (let i = 0; i < count; i++) {
    const entry = ifd0 + 2 + i * 12;
    if (entry + 2 > exif.length) break;
    if (u16(entry) === 0x8825) return true;
  }
  return false;
}

/** Names the metadata kinds present in an image, e.g. ["EXIF (GPS)", "ICC"]. Empty means clean. */
export async function findMetadata(buf) {
  const meta = await sharp(buf).metadata();
  const found = [];
  if (meta.exif) found.push(exifHasGps(meta.exif) ? 'EXIF (GPS)' : 'EXIF');
  if (meta.xmp) found.push('XMP');
  if (meta.iptc) found.push('IPTC');
  if (meta.icc) found.push('ICC');
  if (meta.format === 'webp') {
    for (const id of webpChunks(buf)) {
      const kind = { EXIF: 'EXIF', 'XMP ': 'XMP', ICCP: 'ICC' }[id];
      if (kind && !found.some((f) => f.startsWith(kind))) found.push(kind);
    }
  }
  return found;
}

async function collectImages(paths) {
  const files = [];
  for (const p of paths) {
    const info = await stat(p);
    if (info.isDirectory()) {
      const entries = await readdir(p, { withFileTypes: true });
      const children = entries
        .filter((e) => e.isDirectory() || INPUT_EXTS.has(extname(e.name).toLowerCase()))
        .map((e) => join(p, e.name))
        .sort((a, b) => a.localeCompare(b));
      files.push(...(await collectImages(children)));
    } else if (INPUT_EXTS.has(extname(p).toLowerCase())) {
      files.push(p);
    } else {
      throw new Error(`Unsupported input: ${p}`);
    }
  }
  return files;
}

/** Resolves src/worlds/<world>/assets[/<dir>] and refuses anything that escapes it. */
export function outputDir(root, world, dir = '') {
  if (!WORLD_IDS.includes(world)) throw new Error(`--world must be one of: ${WORLD_IDS.join(', ')}`);
  const base = resolve(root, 'src', 'worlds', world, 'assets');
  if (isAbsolute(dir)) throw new Error('--dir must be relative to the world assets folder');
  const out = resolve(base, dir);
  const rel = relative(base, out);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('--dir must stay inside the world assets folder');
  const parts = rel ? rel.split(sep) : [];
  if (parts.some((part) => part !== toKebabName(part))) throw new Error('--dir segments must be ASCII kebab-case');
  return out;
}

async function encode(input, edge, quality) {
  return sharp(input, { failOn: 'error' })
    .rotate() // apply EXIF orientation to the pixels before the metadata is dropped
    .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
    .toColourspace('srgb')
    .webp({ quality, effort: 6, smartSubsample: true })
    .toBuffer({ resolveWithObject: true }); // no keepMetadata()/withMetadata(): sharp strips everything
}

async function exists(p) {
  return stat(p).then(() => true, () => false);
}

/**
 * Optimizes `inputs` into the world's assets folder. Returns one row per input.
 * Throws before writing anything when names collide or files exist without `force`.
 */
export async function optimizeImages({ world, dir = '', name, force = false, inputs, root = REPO_ROOT }) {
  const out = outputDir(root, world, dir);
  const files = await collectImages(inputs);
  if (!files.length) throw new Error('No images found in the given inputs.');
  const base = name ? toKebabName(name) : undefined;
  const width = String(files.length).length < 2 ? 2 : String(files.length).length;
  const jobs = files.map((file, i) => {
    const stem = base ? `${base}-${String(i + 1).padStart(width, '0')}` : toKebabName(basename(file, extname(file)));
    return { file, stem, full: join(out, `${stem}.webp`), thumb: join(out, `${stem}-thumb.webp`) };
  });

  const seen = new Map();
  for (const job of jobs) {
    if (seen.has(job.stem)) throw new Error(`Name collision "${job.stem}": ${seen.get(job.stem)} and ${job.file}. Pass --name.`);
    seen.set(job.stem, job.file);
    if (!force) {
      for (const target of [job.full, job.thumb]) {
        if (await exists(target)) throw new Error(`${relative(root, target)} exists; pass --force to overwrite.`);
      }
    }
  }

  await mkdir(out, { recursive: true });
  const written = [];
  const rows = [];
  try {
    for (const job of jobs) {
      const source = await readFile(job.file);
      const sourceMeta = await findMetadata(source);
      const full = await encode(source, FULL_EDGE, FULL_QUALITY);
      const thumb = await encode(source, THUMB_EDGE, THUMB_QUALITY);
      for (const [target, result] of [[job.full, full], [job.thumb, thumb]]) {
        await writeFile(target, result.data);
        written.push(target);
        const left = await findMetadata(await readFile(target));
        if (left.length) throw new Error(`Metadata left in ${relative(root, target)}: ${left.join(', ')}`);
      }
      rows.push({
        source: job.file,
        stripped: sourceMeta,
        full: { path: relative(root, job.full), width: full.info.width, height: full.info.height, bytes: full.info.size },
        thumb: { path: relative(root, job.thumb), width: thumb.info.width, height: thumb.info.height, bytes: thumb.info.size },
        clean: true,
      });
    }
  } catch (error) {
    await Promise.all(written.map((p) => rm(p, { force: true })));
    throw error;
  }
  return rows;
}

/** Check mode: returns one row per image with the metadata kinds still present. */
export async function checkImages(inputs) {
  const files = await collectImages(inputs);
  const rows = [];
  for (const file of files) rows.push({ file, found: await findMetadata(await readFile(file)) });
  return rows;
}

export function parseArgs(argv) {
  const opts = { inputs: [], force: false, check: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const v = argv[++i];
      if (v === undefined || v.startsWith('--')) throw new Error(`${arg} needs a value`);
      return v;
    };
    if (arg === '--world') opts.world = value();
    else if (arg === '--dir') opts.dir = value();
    else if (arg === '--name') opts.name = value();
    else if (arg === '--force') opts.force = true;
    else if (arg === '--check') opts.check = true;
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg.startsWith('--')) throw new Error(`Unknown option ${arg}`);
    else opts.inputs.push(arg);
  }
  return opts;
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
const USAGE =
  'Usage:\n  npm run images -- --world <id> [--dir <sub/folder>] [--name <base>] [--force] <file|folder>...\n' +
  '  npm run images -- --check <file|folder>...';

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.inputs.length) {
    console.log(USAGE);
    process.exitCode = opts.help ? 0 : 1;
    return;
  }
  if (opts.check) {
    const rows = await checkImages(opts.inputs);
    for (const row of rows) console.log(`${row.found.length ? 'FAIL' : 'ok  '}  ${row.file}  ${row.found.join(', ') || 'no metadata'}`);
    const failed = rows.filter((r) => r.found.length).length;
    console.log(`\n${rows.length} checked, ${failed} with metadata.`);
    process.exitCode = failed ? 1 : 0;
    return;
  }
  if (!opts.world) throw new Error(`--world is required\n${USAGE}`);
  const rows = await optimizeImages(opts);
  for (const r of rows) {
    console.log(`${basename(r.source)}`);
    console.log(`  source metadata  ${r.stripped.join(', ') || 'none'} -> stripped`);
    console.log(`  full   ${r.full.path}  ${r.full.width}x${r.full.height}  ${kb(r.full.bytes)}  metadata: none`);
    console.log(`  thumb  ${r.thumb.path}  ${r.thumb.width}x${r.thumb.height}  ${kb(r.thumb.bytes)}  metadata: none`);
  }
  console.log(`\n${rows.length} image(s) -> ${rows.length * 2} WebP files, all verified metadata-free.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`optimize-images: ${error.message}`);
    process.exitCode = 1;
  });
}
