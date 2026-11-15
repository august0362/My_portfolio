# Status

Only the Integration/QA owner updates this file, and only after verification. Last updated: 2026-11-15.

**Summary:**
- `main` has the CORE-01 bootstrap (merged `ef5293e`), the CORE-02 app shell (merged `231235c`), the GATE-1 contract freeze (merged `57b8c21`) the CORE-03 image script (merged `7366bbc`) and the Celestial Portal hub from HUB-REV-01..07 (merged `031f974`): contract v1 (frozen), registry of 5 worlds, router with lazy world chunks, WorldFrame (Back to Hub, Suspense, ErrorBoundary + Retry), 404, Settings context (now with appearance and palette), the 2D-canvas Celestial Portal hub with orbiting cards, scene transitions and soundscape, placeholder `meta.ts` + `index.tsx` for production, character, wanderlight and ethereal, and the Information world (Chronicle) integrated from the prototype. Root `/data/` stays ignored.
- M0 is accepted. P-01–P-16 are CONFIRMED (P-09, P-14, P-15 and P-16 on 2026-11-15).
- CORE-01 and CORE-02 are verified and merged. **GATE-1 passed (Lead approval, 2026-11-15): contract v1 is frozen** and `src/worlds/<id>/` now belongs to each world agent. CORE-03 is verified and merged: `npm run images` turns raw photos into metadata-free WebP (full + `-thumb`). **M1 is done.** **M2 is done:** the Lead accepted HUB-01, dropped HUB-02 and the pixel effect, and counts the existing scene transitions as HUB-03 (P-14, 2026-11-15). M3: INFO-01..03 are integrated from the Chronicle prototype (P-15). The other world tasks are on hold until the Lead starts them.

## Milestones

| Milestone | State | Evidence |
|---|---|---|
| M0 Docs & architecture | Done (2026-11-15). P-09 deferred | Decisions in [CONTEXT §4](CONTEXT.md#4-architecture-decisions). Link check: 0 broken links or anchors |
| M1 Foundation & contract | Done (2026-11-15) | CORE-01, CORE-02, CORE-03 verified 2026-11-15 (see Core row). GATE-1 approved by the Lead 2026-11-15 |
| M2 Hub | Done (2026-11-15) | HUB-REV-01..07 merged `031f974`. HUB-01 accepted by the Lead after a browser check. HUB-02 dropped, HUB-03 met by the scene transitions (P-14) |
| M3 Worlds | In progress | Information INFO-01..03 integrated 2026-11-15 (see Information row). Other worlds on hold |
| M4 QA | Not started | — |
| M5 Deployment | Not started | — |

## Modules

| Module | State | Done | Next task | Blockers | Last verified evidence |
|---|---|---|---|---|---|
| Core (shell, hub) | Done for M2 | CORE-01 (verified, merged `ef5293e`; `run.bat` launcher approved by Lead and merged); CORE-02 (verified, merged `231235c` from `409e0f0`); CORE-03 (verified, merged `7366bbc` from `a6ee984`); HUB-REV-01..07 hub (merged `031f974` via `core/HUB-01-integrate-celestial`, cherry-picked without INFO-PROTO commits) | None scheduled | None | 2026-11-15, INFO-01 integration: world routes are full-bleed with a floating Back to Hub link; the shell's 44 px link rule and brand header no longer apply inside worlds; fonts and `darkreader-lock` added to `index.html`; `.gitignore` now ignores only the root `/data/`. HUB-01 accepted by the Lead (browser check, 2026-11-15). Earlier, on merged `main` after HUB-REV: `typecheck`, `lint`, `test` (27/27), `build` all exit 0 (main chunk 300 kB, 96 kB gzip; 5 world chunks); no DOB/phone pattern in `dist/`; no image or `data/` file tracked. Not yet checked in a browser. Accepted deviations (P-13): sound on by default with no off switch (WCAG 1.4.2), no in-app motion toggle. Earlier, after CORE-03: `typecheck`, `lint`, `test` (22/22), `build` all exit 0. CORE-03 on the 17 raw photos in `data/Image` (written to a throwaway folder, then removed): 34 WebP outputs, `--check` reports 0/34 with metadata while the raw photos report 9/17; byte scan finds no Exif/XMP/ICCP/Photoshop/8BIM/GPS strings; EXIF-rotated photos keep their orientation and colour; rerun without `--force`, `--dir ../../core` and `--world hub` are all refused; `data/` unchanged; no image or `data/` file tracked. CORE-02 evidence (2026-11-15): `typecheck`, `lint`, `test` (13/13), `build` all exit 0; 5 world chunks split from main chunk. `vite preview` (Chromium, 1280 px and 375 px): all 5 routes and a deep sub-path survive reload, unknown route → 404, no console errors, no horizontal overflow, touch targets ≥ 44 px. Keyboard: focus moves to `<main>`, first Tab = Back to Hub, visible 3 px focus ring, settings operable and persisted; `prefers-reduced-motion` → `motion=reduced`. Throwing world (probe build) and blocked world chunk both show the fallback; Hub and other worlds keep working; Retry recovers. Probe imports: 6/6 violations rejected, valid imports accepted, probes removed. ESLint ignore is limited to `prototypes/information/**` (other paths still linted). No DOB/phone, images or `data/` in the merge or `dist/` |
| Information | Integrated, browser check pending | INFO-01, INFO-02, INFO-03 from the Chronicle prototype (`995e79c`) moved into `src/worlds/information/` (P-15): identity, journey, 3 albums (16 photos), skills, public CV sheet (no phone, no file). Colors paired with the Atmosphere palette and light/dark (P-16, THEME-01) | Lead browser check of `/information` in all 3 palettes, light and dark | Portrait and milestone photos (the Lead will supply them) | 2026-11-15: `typecheck`, `lint`, `test` (110 pass, 1 skipped: the raw-JSON check, which passes when run against the main checkout's `data/`), `build` all exit 0. Main chunk 300.8 kB (96.6 kB gzip); `information` chunk 60.7 kB JS + 46 kB CSS; photos load lazily from the world. Tests check every photo has only a `VP8 ` chunk, no birth date or phone pattern in the module, Life Moments shows the year only. No phone or birthday string in `dist/`. Not yet checked in a browser |
| Production | Not started | — | PROD-01 | Verified project facts (for PROD-02) | 2026-11-15: no code or data |
| Character | Not started | — | CHAR-01 | Character data | 2026-11-15: no code or data |
| Wanderlight | Not started | — | WAND-01 | Gameplay approval | 2026-11-15: no code or data |
| Ethereal | Not started | — | ETH-01 | Theme approval; audio license | 2026-11-15: no code or data |

## Known issues

- `npm audit`: 7 moderate findings, all from `minimatch` 10.2.6 inside `@typescript-eslint/typescript-estree` 8.72.2 (GHSA-g3hv-75wg-m249). Dev/lint tooling only, not in `dist/`. No fix is possible yet: 8.72.2 is the latest stable typescript-eslint, it requires `minimatch ^10.2.2`, and the fix is only in 11.0.1+. Upstream canary already uses `^11.0.1`. Plan: upgrade when typescript-eslint 8.72.3 stable ships (CORE-DEPS, checked 2026-11-15, no commit).

## Open change requests

- None open. Resolved 2026-11-15: the INFO-PROTO commits now live only on `information/INFO-PROTO-chronicle` (tip `995e79c`); they are not on `main`. The old branches `core/HUB-REV-*` and `info/INFO-PROTO-chronicle-polish` still mix both and can be deleted once the Lead agrees.
