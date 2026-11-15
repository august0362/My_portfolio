# Photo provenance

| Album | Files | Source |
|---|---|---|
| Studio Photography | `photos/studio/` (8) | Lead-supplied folder, P-09 mapping |
| Cosplay Collection | `photos/cosplay/` (3) | Lead-supplied folder, P-09 mapping |
| Life Moments | `photos/life/` (5) | Lead-supplied folder, P-09 mapping |

The source-folder mapping is in `docs/modules/information.md` (Missing assets/data). Raw files stay in `data/` and are never imported. No photographer credit is shown (Lead decision, 2026-11-15).

## Processing (stopgap until CORE-03)

- Decoded in Chrome with EXIF orientation applied, resized to 2048 px (full) and 1024 px (thumbnail) on the long edge, and re-encoded to lossy WebP (quality 0.82 / 0.78).
- The RIFF container was rebuilt with only the `VP8 ` image chunk. No `EXIF`, `XMP ` or `ICCP` chunk is present (checked chunk by chunk on all 32 files).
- Content review (2026-11-15): there is no visible date or number in any photo. In Cosplay 01, a few bystanders appear far away and blurred. The fourth Cosplay Festival source photo is not published because it shows a third-party shop sign (Lead decision).
- Regenerate all files with CORE-03 once it exists.
