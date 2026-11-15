# Plan

Rules:
- Each task has one owner and one module.
- Task IDs are stable. Do not renumber them, and add new tasks with the next free number.
- Status lives in [STATUS.md](STATUS.md), not here.

Universal acceptance for every coding task: `npm run typecheck`, `npm run lint`, `npm run test` and `npm run build` all pass, and the handoff report is delivered ([AGENT_RULES §6–7](AGENT_RULES.md#6-verification)).

```text
M0 ─► M1 ─► GATE-1 (contract freeze) ─┬─► M2 (Core: hub)          ─┐
                                      └─► M3 (5 worlds, parallel) ─┴─► M4 ─► M5
```

## M0–M2: Done

| ID | Owner | Task | Outcome |
|---|---|---|---|
| DOC-01 | Architect | Documentation system | Done (M0) |
| CORE-01 | Core | Vite React-TS scaffold, pinned deps, scripts, aliases, ESLint boundary rule, Vitest | Merged |
| CORE-02 | Core | Contract, settings, tokens, router, registry, WorldFrame, 404, placeholder worlds | Merged |
| CORE-03 | Core | `scripts/optimize-images.mjs`: metadata-free WebP full + thumbnail | Merged |
| GATE-1 | Lead | Freeze contract v1 | Approved |
| HUB-01 | Core | Accessible hub with settings control | Accepted (Celestial Portal, HUB-REV) |
| HUB-02 | Core | Lazy WebGL HubScene and Möbius ribbon | Dropped ([P-14](CONTEXT.md#4-architecture-decisions)) |
| HUB-03 | Core | Hub ↔ world transitions | Met by the scene transitions; pixel effect dropped (P-14) |
| THEME-01 | Core | Pair world colors with the Atmosphere palette | Done ([P-16](CONTEXT.md#4-architecture-decisions)) |

## M3: Independent world development

- **Goal:** the V1 content of each world.
- **Dependencies:** GATE-1. Different worlds run in parallel, and tasks within one world run one at a time.
- **Scope:** `src/worlds/<id>/` only. Colors follow the Atmosphere palette (P-16).
- **Acceptance:** each module doc defines the acceptance for its tasks.
- **Evidence:** a handoff report per task.

| ID | Owner | Task | Blocked by |
|---|---|---|---|
| INFO-01 | Information | Identity, Knowledge & Skills, Resume & Connect | Done (P-15) |
| INFO-02 | Information | My Journey timeline (component + schema) | Done (P-15) |
| INFO-03 | Information | Fragments of Me gallery (albums, optimized images) | Done (P-15) |
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
- **Dependencies:** M4, the Git remote ([CONTEXT §5](CONTEXT.md#5-not-yet-decided)) and a Cloudflare account (pending), both provided by the Lead.
- **Evidence:** the public URL and smoke-test results in STATUS.

| ID | Owner | Task | Acceptance |
|---|---|---|---|
| DEP-01 | Integration | Cloudflare Pages project (build `npm run build`, output `dist`) | Preview deploy works. Deep links work after reload |
| DEP-02 | Integration | Production deploy + smoke test on desktop and mobile | Every route loads on the public URL. Reduced motion and static tier work |
