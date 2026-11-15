# Status

Only the Integration/QA owner updates this file, and only after verification. Last updated: 2026-11-15.

**Summary:**
- `main` has the CORE-01 bootstrap (merged `ef5293e`), the CORE-02 app shell (merged `231235c`), the GATE-1 contract freeze (merged `57b8c21`) and the CORE-03 image script (merged `7366bbc`): contract v1 (frozen), registry of 5 worlds, router with lazy world chunks, WorldFrame (Back to Hub, Suspense, ErrorBoundary + Retry), 404, Settings context, plain HubNav, placeholder `meta.ts` + `index.tsx` per world. `data/` stays ignored.
- M0 is accepted. P-01–P-08, P-10 and P-11 are CONFIRMED. P-09 is DEFERRED and blocks INFO-03 only.
- CORE-01 and CORE-02 are verified and merged. **GATE-1 passed (Lead approval, 2026-11-15): contract v1 is frozen** and `src/worlds/<id>/` now belongs to each world agent. CORE-03 is verified and merged: `npm run images` turns raw photos into metadata-free WebP (full + `-thumb`). **M1 is done. Next: M2 (HUB-01) and the world tasks (INFO-01, PROD-01, CHAR-01, WAND-01, ETH-01).**

## Milestones

| Milestone | State | Evidence |
|---|---|---|
| M0 Docs & architecture | Done (2026-11-15). P-09 deferred | Decisions in [CONTEXT §4](CONTEXT.md#4-architecture-decisions). Link check: 0 broken links or anchors |
| M1 Foundation & contract | Done (2026-11-15) | CORE-01, CORE-02, CORE-03 verified 2026-11-15 (see Core row). GATE-1 approved by the Lead 2026-11-15 |
| M2 Hub | Not started | — |
| M3 Worlds | Not started | — |
| M4 QA | Not started | — |
| M5 Deployment | Not started | — |

## Modules

| Module | State | Done | Next task | Blockers | Last verified evidence |
|---|---|---|---|---|---|
| Core (shell, hub) | In progress | CORE-01 (verified, merged `ef5293e`; `run.bat` launcher approved by Lead and merged); CORE-02 (verified, merged `231235c` from `409e0f0`); CORE-03 (verified, merged `7366bbc` from `a6ee984`) | M2 (HUB-01) | None | 2026-11-15 on merged `main` after CORE-03: `typecheck`, `lint`, `test` (22/22), `build` all exit 0. CORE-03 on the 17 raw photos in `data/Image` (written to a throwaway folder, then removed): 34 WebP outputs, `--check` reports 0/34 with metadata while the raw photos report 9/17; byte scan finds no Exif/XMP/ICCP/Photoshop/8BIM/GPS strings; EXIF-rotated photos keep their orientation and colour; rerun without `--force`, `--dir ../../core` and `--world hub` are all refused; `data/` unchanged; no image or `data/` file tracked. CORE-02 evidence (2026-11-15): `typecheck`, `lint`, `test` (13/13), `build` all exit 0; 5 world chunks split from main chunk. `vite preview` (Chromium, 1280 px and 375 px): all 5 routes and a deep sub-path survive reload, unknown route → 404, no console errors, no horizontal overflow, touch targets ≥ 44 px. Keyboard: focus moves to `<main>`, first Tab = Back to Hub, visible 3 px focus ring, settings operable and persisted; `prefers-reduced-motion` → `motion=reduced`. Throwing world (probe build) and blocked world chunk both show the fallback; Hub and other worlds keep working; Retry recovers. Probe imports: 6/6 violations rejected, valid imports accepted, probes removed. ESLint ignore is limited to `prototypes/information/**` (other paths still linted). No DOB/phone, images or `data/` in the merge or `dist/` |
| Information | Not started | Raw data only: identity JSON, CV, 17 photos in `data/` | INFO-01 | Skills list; public CV; P-09 (INFO-03) | 2026-11-15: file inventory |
| Production | Not started | — | PROD-01 | Verified project facts (for PROD-02) | 2026-11-15: no code or data |
| Character | Not started | — | CHAR-01 | Character data | 2026-11-15: no code or data |
| Wanderlight | Not started | — | WAND-01 | Gameplay approval | 2026-11-15: no code or data |
| Ethereal | Not started | — | ETH-01 | Theme approval; audio license | 2026-11-15: no code or data |

## Open change requests

- **Lead decision: `prototypes/information/`.** CORE-02 adds a narrow ESLint ignore for it, so lint passes. It is now committed as `abaaade` ([INFO-PROTO]) on top of CORE-02 on branch `core/CORE-02-app-shell`, not on `information/INFO-PROTO-chronicle`. It was **not** merged to `main`. Lead to decide where that commit belongs.
