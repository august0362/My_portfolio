# Status

Only the Integration/QA owner updates this file, and only after verification. Last updated: 2026-11-15.

**Summary:**
- `main` has the CORE-01 bootstrap (merged `ef5293e`): Vite React-TS shell, pinned deps, ESLint import-boundary rule, Vitest. `data/` stays ignored. No hub, contract or worlds yet.
- M0 is accepted. P-01–P-08, P-10 and P-11 are CONFIRMED. P-09 is DEFERRED and blocks INFO-03 only.
- CORE-01 is verified and merged. **Ready to assign CORE-02.** The contract is **not** frozen (GATE-1 is pending CORE-02).

## Milestones

| Milestone | State | Evidence |
|---|---|---|
| M0 Docs & architecture | Done (2026-11-15). P-09 deferred | Decisions in [CONTEXT §4](CONTEXT.md#4-architecture-decisions). Link check: 0 broken links or anchors |
| M1 Foundation & contract | In progress: CORE-01 done, CORE-02/03 and GATE-1 pending | CORE-01 verified 2026-11-15 (see Core row) |
| M2 Hub | Not started | — |
| M3 Worlds | Not started | — |
| M4 QA | Not started | — |
| M5 Deployment | Not started | — |

## Modules

| Module | State | Done | Next task | Blockers | Last verified evidence |
|---|---|---|---|---|---|
| Core (shell, hub) | In progress | CORE-01 (verified, merged `ef5293e`) | CORE-02 | None | 2026-11-15 on `main`: `typecheck`, `lint`, `test` (1/1), `build` all exit 0. Probe imports: 8/8 violations rejected (world→world, world→core, shared→core/worlds; alias and relative); valid imports accepted; probes removed. `data/` untracked, no DOB/phone in tracked files or history |
| Information | Not started | Raw data only: identity JSON, CV, 17 photos in `data/` | INFO-01 (after GATE-1) | GATE-1; skills list; public CV; P-09 (INFO-03) | 2026-11-15: file inventory |
| Production | Not started | — | PROD-01 (after GATE-1) | GATE-1; verified project facts (for PROD-02) | 2026-11-15: no code or data |
| Character | Not started | — | CHAR-01 (after GATE-1) | GATE-1; character data | 2026-11-15: no code or data |
| Wanderlight | Not started | — | WAND-01 (after GATE-1) | GATE-1; gameplay approval | 2026-11-15: no code or data |
| Ethereal | Not started | — | ETH-01 (after GATE-1) | GATE-1; theme approval; audio license | 2026-11-15: no code or data |

## Open change requests

- **Lead decision: `run.bat`** (commit `b7ed875`, branch `core/CORE-01-bootstrap`). A Windows dev launcher outside the CORE-01 task list. Reviewed and harmless, but **not merged** until the Lead approves it.
- **Lead decision: untracked `prototypes/information/`** (appeared 2026-11-15, not part of any commit). `npm run lint` fails on it (`import-x/no-unresolved`). It sits outside `src/worlds/information/`, so it is out of Information ownership. Lead to either move it into scope, ignore it via a Core-approved config change, or remove it.
