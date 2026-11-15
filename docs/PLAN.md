# Plan

Rules:
- Each task has one owner and one module.
- Task IDs are stable. Do not renumber them, and add new tasks with the next free number.
- Status lives in [STATUS.md](STATUS.md), not here.

Universal acceptance for every coding task: `npm run typecheck`, `npm run lint`, `npm run test` and `npm run build` all pass, and the handoff report is delivered ([AGENT_RULES §6–7](AGENT_RULES.md#6-verification)).

Order of work:

```text
M0 ─► M1 ─► GATE-1 (contract freeze) ─┬─► M2 (Core: hub)          ─┐
                                      └─► M3 (5 worlds, parallel) ─┴─► M4 ─► M5
```

## M0: Documentation and architecture

- **Goal:** a shared understanding and an approved architecture.
- **Deliverables:** `README.md`, `CLAUDE.md` and `docs/**`.
- **Dependencies:** none.
- **Acceptance:** every decision in [CONTEXT §4](CONTEXT.md#4-architecture-decisions) is CONFIRMED, or DEFERRED with the tasks it blocks named. A deferred decision blocks only those tasks, not M1. For example, P-09 blocks INFO-03 only.
- **Evidence:** the docs exist, and each decision's status is recorded in CONTEXT §4.

| ID | Owner | Task |
|---|---|---|
| DOC-01 | Architect | Create the documentation system |

## M1: Shared foundation and integration contract

- **Goal:** a buildable app shell with the frozen world contract and five placeholder worlds.
- **Dependencies:** M0 acceptance. Deferred decisions (P-09) do not block M1. This milestone runs **serially, done by the Core agent only**.
- **Scope:** everything in §2 of [ARCHITECTURE](ARCHITECTURE.md#2-repository-layout) except the hub visuals and world content.
- **Evidence:** command output, plus a `vite preview` check of all routes, recorded in STATUS.

| ID | Owner | Task | Acceptance |
|---|---|---|---|
| CORE-01 | Core | Bootstrap (Git already initialized on `main`; work on the task branch): extend `.gitignore` as needed while keeping `data/` excluded (P-08), Vite React-TS scaffold, pinned deps, scripts `dev/build/preview/typecheck/lint/test`, path aliases, ESLint import-boundary rule, Vitest | All scripts run. Temporary probe imports fail lint in both forms, alias (`@worlds/<b>`, `@core/*`) and relative (`../<b>/…`, `../../core/…`), for world → other world, world → core and shared → core/worlds. Lint output is in the handoff, and the probes are then removed |
| CORE-02 | Core | `shared/contract.ts`, `settings.tsx`, `tokens.css`; router; `registry.ts`; `WorldFrame` (back-to-hub, Suspense, ErrorBoundary); 404; a placeholder `meta.ts` + `index.tsx` for all 5 worlds; plain HubNav list on `/` | All 5 routes and deep-link reloads work in `vite preview`. Unknown route shows 404. A throwing world shows the error fallback and the hub still works. Contract test passes |
| CORE-03 | Core | `scripts/optimize-images.mjs` (sharp): WebP full + thumbnail, metadata stripped, kebab-case names | Output has no EXIF/GPS (verified by tool output). Documented in a script header |
| GATE-1 | Lead | Freeze contract v1 | Only after CORE-02 is implemented, verified by Integration and approved by the Lead. Until then the contract may change. Approval noted in STATUS. Ownership of `src/worlds/<id>/` passes to the world agents |

## M2: Core Möbius Hub and world placeholders

- **Goal:** the full hub experience.
- **Dependencies:** GATE-1. This milestone runs in parallel with M3.
- **Scope:** `src/core/hub/` and `src/core/transitions/` only.
- **Evidence:** a short screen recording or screenshots for each tier, plus a keyboard-only walkthrough noted in the handoff.

| ID | Owner | Task | Acceptance |
|---|---|---|---|
| HUB-01 | Core | Accessible static hub: styled HubNav cards, static-tier layout, settings control | Keyboard, touch and screen-reader navigation to all 5 worlds. Works with WebGL unavailable |
| HUB-02 | Core | Lazy HubScene: Möbius ribbon, starfield, orbiting DOM cards, hover/focus stabilization, quality tiers, pause when hidden, dispose on exit | three/R3F absent from the main chunk (build report). Reduced motion yields the static tier. No console errors |
| HUB-03 | Core | Hub ↔ world transitions + pixel reconstruction effect ([ARCHITECTURE §8](ARCHITECTURE.md#8-möbius-hub)) | Effect never runs on a hovered/focused card or under reduced motion. Navigation never waits on the effect |

## M3: Independent world development

- **Goal:** the V1 content of each world.
- **Dependencies:** GATE-1. Different worlds run in parallel, and tasks within one world run one at a time.
- **Scope:** `src/worlds/<id>/` only.
- **Acceptance:** each module doc defines the acceptance for its tasks.
- **Evidence:** a handoff report per task.

| ID | Owner | Task | Blocked by |
|---|---|---|---|
| INFO-01 | Information | Identity, Knowledge & Skills, Resume & Connect | Skills list confirmation; public CV file |
| INFO-02 | Information | My Journey timeline (component + schema, placeholders) | Milestones for real content only |
| INFO-03 | Information | Fragments of Me gallery (albums, optimized images) | CORE-03; P-09 (DEFERRED) confirmed by the Lead |
| PROD-01 | Production | Catalog + detail view + schema, placeholder entries | none |
| PROD-02 | Production | Fill in verified project content | Lead-supplied project facts and links |
| CHAR-01 | Character | Gallery + detail route with placeholder entries | none |
| WAND-01 | Wanderlight | Gameplay design note (doc only, in the module doc) | none |
| WAND-02 | Wanderlight | One-scene prototype per the approved WAND-01 | WAND-01 approval |
| ETH-01 | Ethereal | One scene with interactions and audio controls (silent or placeholder audio) | Scene theme approval |
| ETH-02 | Ethereal | Add licensed or original ambient audio | Audio asset + license |

## M4: Integration, QA and optimization

- **Goal:** a merged `main` that meets every acceptance criterion.
- **Dependencies:** M2 plus the world tasks that are in scope for release.
- **Evidence:** the QA results summary in STATUS.

| ID | Owner | Task | Acceptance |
|---|---|---|---|
| QA-01 | Integration | Merge verified branches; full-route smoke test in `vite preview` | All gates pass on `main` |
| QA-02 | Integration | Accessibility pass: keyboard, focus, reduced motion, contrast, touch | Issues fixed or filed against the owning module |
| QA-03 | Integration | Performance measurement (Lighthouse mobile/desktop, chunk sizes, GPU pause checks) | Measured numbers recorded; regressions assigned |
| QA-04 | Integration | Privacy and licensing audit | No DOB or phone number anywhere in `dist/`; images metadata-free; every third-party asset in `CREDITS.md`; placeholders listed |

## M5: Public deployment

- **Goal:** the site is live on static hosting.
- **Dependencies:** M4, a Git remote (supplied, see [CONTEXT §5](CONTEXT.md#5-not-yet-decided)) and a Cloudflare account (pending), both provided by the Lead.
- **Evidence:** the public URL and smoke-test results in STATUS.

| ID | Owner | Task | Acceptance |
|---|---|---|---|
| DEP-01 | Integration | Cloudflare Pages project (build `npm run build`, output `dist`) | Preview deploy works. Deep links work after reload |
| DEP-02 | Integration | Production deploy + smoke test on desktop and mobile | Every route loads on the public URL. Reduced motion and static tier work |
