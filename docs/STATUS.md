# Status

Only the Integration/QA owner updates this file, and only after verification. Last updated: 2026-11-15.

**Summary:**
- `main` has the CORE-01 bootstrap (merged `ef5293e`), the CORE-02 app shell (merged `231235c`), the GATE-1 contract freeze (merged `57b8c21`) the CORE-03 image script (merged `7366bbc`) and the Celestial Portal hub from HUB-REV-01..07 (merged `031f974`): contract v1 (frozen), registry of 5 worlds, router with lazy world chunks, WorldFrame (Back to Hub, Suspense, ErrorBoundary + Retry), 404, Settings context (now with appearance and palette), the 2D-canvas Celestial Portal hub with orbiting cards, scene transitions and soundscape, placeholder `meta.ts` + `index.tsx` per world. `data/` stays ignored.
- M0 is accepted. P-01–P-08 and P-10–P-13 are CONFIRMED. P-09 is DEFERRED and blocks INFO-03 only.
- CORE-01 and CORE-02 are verified and merged. **GATE-1 passed (Lead approval, 2026-11-15): contract v1 is frozen** and `src/worlds/<id>/` now belongs to each world agent. CORE-03 is verified and merged: `npm run images` turns raw photos into metadata-free WebP (full + `-thumb`). **M1 is done.** M2 is in progress: the Lead approved reusing HUB-REV as the hub base (2026-11-15), and it is merged with the P-12 (public name Celestial Portal) and P-13 (hub settings) doc updates. Next: the HUB-01 browser acceptance check and the world tasks (INFO-01, PROD-01, CHAR-01, WAND-01, ETH-01).

## Milestones

| Milestone | State | Evidence |
|---|---|---|
| M0 Docs & architecture | Done (2026-11-15). P-09 deferred | Decisions in [CONTEXT §4](CONTEXT.md#4-architecture-decisions). Link check: 0 broken links or anchors |
| M1 Foundation & contract | Done (2026-11-15) | CORE-01, CORE-02, CORE-03 verified 2026-11-15 (see Core row). GATE-1 approved by the Lead 2026-11-15 |
| M2 Hub | In progress | HUB-REV-01..07 merged `031f974` (2026-11-15), build gates pass. HUB-01 browser acceptance not yet checked. HUB-02/03 scope to be confirmed by the Lead (the hub has no WebGL ribbon; transitions exist) |
| M3 Worlds | Not started | — |
| M4 QA | Not started | — |
| M5 Deployment | Not started | — |

## Modules

| Module | State | Done | Next task | Blockers | Last verified evidence |
|---|---|---|---|---|---|
| Core (shell, hub) | In progress | CORE-01 (verified, merged `ef5293e`; `run.bat` launcher approved by Lead and merged); CORE-02 (verified, merged `231235c` from `409e0f0`); CORE-03 (verified, merged `7366bbc` from `a6ee984`); HUB-REV-01..07 hub (merged `031f974` via `core/HUB-01-integrate-celestial`, cherry-picked without INFO-PROTO commits) | HUB-01 browser acceptance (keyboard, touch, screen reader, 375 px, all 5 worlds) | None | 2026-11-15 on merged `main` after HUB-REV: `typecheck`, `lint`, `test` (27/27), `build` all exit 0 (main chunk 300 kB, 96 kB gzip; 5 world chunks); no DOB/phone pattern in `dist/`; no image or `data/` file tracked. Not yet checked in a browser. Accepted deviations (P-13): sound on by default with no off switch (WCAG 1.4.2), no in-app motion toggle. Earlier, after CORE-03: `typecheck`, `lint`, `test` (22/22), `build` all exit 0. CORE-03 on the 17 raw photos in `data/Image` (written to a throwaway folder, then removed): 34 WebP outputs, `--check` reports 0/34 with metadata while the raw photos report 9/17; byte scan finds no Exif/XMP/ICCP/Photoshop/8BIM/GPS strings; EXIF-rotated photos keep their orientation and colour; rerun without `--force`, `--dir ../../core` and `--world hub` are all refused; `data/` unchanged; no image or `data/` file tracked. CORE-02 evidence (2026-11-15): `typecheck`, `lint`, `test` (13/13), `build` all exit 0; 5 world chunks split from main chunk. `vite preview` (Chromium, 1280 px and 375 px): all 5 routes and a deep sub-path survive reload, unknown route → 404, no console errors, no horizontal overflow, touch targets ≥ 44 px. Keyboard: focus moves to `<main>`, first Tab = Back to Hub, visible 3 px focus ring, settings operable and persisted; `prefers-reduced-motion` → `motion=reduced`. Throwing world (probe build) and blocked world chunk both show the fallback; Hub and other worlds keep working; Retry recovers. Probe imports: 6/6 violations rejected, valid imports accepted, probes removed. ESLint ignore is limited to `prototypes/information/**` (other paths still linted). No DOB/phone, images or `data/` in the merge or `dist/` |
| Information | Not started | Raw data in `data/`. Prototype on `information/INFO-PROTO-chronicle` (`995e79c`, not merged): public CV data (`SHOW_GRADES = true`, Lead 2026-11-15), journey, albums | INFO-01 | Skills list confirmed by the Lead (2026-11-15). Real portrait and milestone photos: the Lead will supply them later. P-09 (INFO-03) | 2026-11-15: prototype's 32 tracked WebP files report 0 with metadata (`--check`); no DOB/phone pattern in the prototype |
| Production | Not started | — | PROD-01 | Verified project facts (for PROD-02) | 2026-11-15: no code or data |
| Character | Not started | — | CHAR-01 | Character data | 2026-11-15: no code or data |
| Wanderlight | Not started | — | WAND-01 | Gameplay approval | 2026-11-15: no code or data |
| Ethereal | Not started | — | ETH-01 | Theme approval; audio license | 2026-11-15: no code or data |

## Open change requests

- None open. Resolved 2026-11-15: the INFO-PROTO commits now live only on `information/INFO-PROTO-chronicle` (tip `995e79c`); they are not on `main`. The old branches `core/HUB-REV-*` and `info/INFO-PROTO-chronicle-polish` still mix both and can be deleted once the Lead agrees.
