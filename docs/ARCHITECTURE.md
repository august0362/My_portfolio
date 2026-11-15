# Architecture

Status: the direction is **CONFIRMED** (P-01–P-08, P-10, P-11). Nothing here is implemented yet; see [STATUS.md](STATUS.md). The module contract (§5) is frozen as v1 since GATE-1 (Lead, 2026-11-15). Decision IDs (P-xx) refer to [CONTEXT §4](CONTEXT.md#4-architecture-decisions).

## 1. Technology choices

| Concern | Choice | Notes |
|---|---|---|
| App | React + TypeScript + Vite (P-01) | Single-page app, static `dist/` output |
| Routing | React Router, declarative `<Routes>` (P-02) | Worlds own nested routes under `/<id>/*` |
| 3D | `three` + `@react-three/fiber` (P-03) | Lazy-loaded only. Needs WebGL2; without it the site falls back to the static tier |
| Styling | CSS custom-property tokens + CSS Modules (P-04) | No CSS framework |
| State | React state/context only | No global store library |
| Quality gates | `tsc`, ESLint, Vitest, `vite build` (P-05) | No E2E framework in V1 |
| Hosting | Cloudflare Pages (P-06) | Static, no functions |

Not used: SSR or meta-frameworks, a backend, a database, auth, CMS, microfrontends, monorepo tools, plugin systems, DI, or game engines unless the Lead approves one.

## 2. Repository layout

```text
index.html                 Core
package.json, lockfile     Core
vite.config.ts, tsconfig*.json, eslint.config.js   Core
public/                    Core: favicon, robots.txt, OG image (stable-URL files only)
scripts/                   Core: build-time tools (image optimizer)
data/                      Raw source material. Never imported by app code (P-08)
docs/                      See AGENT_RULES §2 for edit rights
src/
  main.tsx                 Core
  core/                    Core: shell, router, registry, hub, transitions, 404
    registry.ts
    shell/                 AppShell, WorldFrame (back-to-hub, Suspense, ErrorBoundary)
    hub/                   HubNav (DOM cards), HubScene (lazy WebGL), pixel effect
    transitions/
  shared/                  Core-owned; the ONLY internal code worlds may import
    contract.ts            WorldId, WorldMeta, WorldDefinition
    settings.tsx           SettingsProvider + useSettings (motion, quality, sound, appearance, palette)
    tokens.css             Design tokens
    ui/                    Genuinely reusable primitives (added only when 2+ worlds need them)
  worlds/
    information/           Information agent
    production/            Production agent
    character/             Character agent
    wanderlight/           Wanderlight agent
    ethereal/              Ethereal agent
```

Each world folder holds `meta.ts`, `index.tsx` and any of `components/`, `data/`, `assets/`, `types.ts` and `*.module.css`.

## 3. Boundaries and import rules

```text
main.tsx ──► core/ ──► worlds/<id>/meta.ts      (static import, tiny)
                 └───► worlds/<id>/index.tsx     (lazy import only)
core/      ──► shared/
worlds/<id>/** ──► shared/**  and npm packages
worlds/<a>/**  ──✕──► worlds/<b>/**, core/**
shared/**      ──✕──► core/**, worlds/**
```

- ESLint enforces these rules for **both** alias imports (`@core/*`, `@shared/*`, `@worlds/*`) and relative imports (for example `../production/x` or `../../core/x`).
  - String-only `no-restricted-imports` patterns cannot reliably catch relative paths.
  - CORE-01 must use a rule that resolves the target file path, with a TypeScript resolver so aliases resolve too. The recommended rule is a `no-restricted-paths` zone rule from an import plugin.
  - CORE-01 records the chosen rule and proves it with probe imports ([PLAN M1](PLAN.md#m1-shared-foundation-and-integration-contract)).
- World CSS must be CSS Modules or selectors scoped under the world root class. Worlds must not style `html` or `body`, change global tokens, or leave global listeners without cleanup.
- A world may define its own look by setting CSS variables on its root element.
- Dependencies between Core and worlds: worlds depend on `shared/contract.ts`, `shared/settings.tsx`, `shared/tokens.css` and the npm packages chosen in `package.json`. Core depends only on each world's `meta.ts` and its default export.

## 4. Routes

| Path | Owner | Content |
|---|---|---|
| `/` | Core | Möbius Hub |
| `/information/*` | Information | Single page with five sections. Sub-routes are optional |
| `/production/*` | Production | `/production` catalog, `/production/:slug` detail |
| `/character/*` | Character | `/character` gallery, `/character/:slug` detail (future) |
| `/wanderlight/*` | Wanderlight | One scene |
| `/ethereal/*` | Ethereal | One scene |
| `*` | Core | 404 page with a link back to the hub |

## 5. Module contract

The contract is Core-owned. **Contract v1 is frozen** since GATE-1, approved by the Lead on 2026-11-15 after CORE-02 was implemented and verified ([PLAN](PLAN.md#m1-shared-foundation-and-integration-contract)). Any change now needs a Core change request and an update to every affected world in the same integration step ([§13](#13-changing-shared-architecture)).

```ts
// src/shared/contract.ts
import type { ComponentType } from 'react';

export const WORLD_IDS = ['information', 'production', 'character', 'wanderlight', 'ethereal'] as const;
export type WorldId = (typeof WORLD_IDS)[number];

/** Lives in src/worlds/<id>/meta.ts, owned by the world. Imports only types and one small preview image. */
export interface WorldMeta {
  id: WorldId;        // frozen
  title: string;      // card label and document title
  tagline: string;    // one line on the card
  preview?: string;   // small image URL (imported asset)
  accent?: string;    // CSS color for card glow
}

/** Built by Core in src/core/registry.ts. */
export interface WorldDefinition extends WorldMeta {
  path: `/${WorldId}`;
  load: () => Promise<{ default: ComponentType }>; // world entry, no props
}
```

```ts
// src/core/registry.ts (Core-owned; one line per world)
import information from '@worlds/information/meta';
// ...the other four metas
export const WORLDS: readonly WorldDefinition[] = [
  { ...information, path: '/information', load: () => import('@worlds/information') },
  // ...
];
```

Rules:
- A world may edit `title`, `tagline`, `preview` and `accent` in its own `meta.ts`. Changing `id`, `path`, the registry or `contract.ts` goes through Core ([change request](AGENT_RULES.md#8-escalation-and-change-requests)).
- The entry is the default export of `src/worlds/<id>/index.tsx`. It takes no props and reads global preferences through `useSettings()`.
- A world does not render global navigation, a back-to-hub button or shell transitions. Core provides all of these.
- A Vitest contract test checks that IDs are unique, `path === '/' + id`, every `WORLD_IDS` entry is registered, and every `load()` resolves to a component.

## 6. Example: minimal world module

```text
src/worlds/character/
  meta.ts
  index.tsx
  Character.module.css
  types.ts
  data/characters.ts
```

```ts
// meta.ts
import type { WorldMeta } from '@shared/contract';
const meta: WorldMeta = { id: 'character', title: 'Astral Codex', tagline: 'Placeholder tagline' };
export default meta;
```

```tsx
// index.tsx
import { Routes, Route, Link, useParams } from 'react-router';
import { characters } from './data/characters';
import styles from './Character.module.css';

function Gallery() {
  return (
    <ul className={styles.grid}>
      {characters.map((c) => <li key={c.slug}><Link to={c.slug}>{c.name}</Link></li>)}
    </ul>
  );
}
function Detail() {
  const c = characters.find((x) => x.slug === useParams().slug);
  return c ? <h1>{c.name}</h1> : <p>Not found</p>;
}
export default function CharacterWorld() {
  return (
    <div className={styles.root}>
      <Routes>
        <Route index element={<Gallery />} />
        <Route path=":slug" element={<Detail />} />
      </Routes>
    </div>
  );
}
```

## 7. Shell behavior (Core)

- `WorldFrame` wraps every world. It renders a back-to-hub control that is always visible and is the first keyboard stop. It also sets `document.title`, moves focus to the world's `<main>` after navigation, and shows a `Suspense` loading state.
- An `ErrorBoundary` around each world shows a message with **Retry** and **Back to Hub**, so a crashing world never breaks the shell or the hub.
- Lazy components are created once per world from `load()`. Hovering or focusing a hub card calls `load()` to prefetch the world.
- Settings (`shared/settings.tsx`), per the Lead decision of 2026-11-15 ([P-13](CONTEXT.md#4-architecture-decisions)):
  - `motion: 'full' | 'reduced'` follows `prefers-reduced-motion` only.
  - `quality: 'full' | 'lite' | 'static'` starts at `full`.
  - `sound: boolean` defaults to `true`.
  - `appearance: 'dark' | 'light'` defaults to `dark` and does not follow the browser colour scheme.
  - `palette: 'moonlit' | 'rosewater' | 'tidal'` defaults to `moonlit`.
- Core renders the settings control (the Atmosphere panel). Only `appearance` and `palette` can be chosen there and restored from `localStorage`; saved `motion`, `quality` and `sound` values are ignored. Storage uses try/catch, and the app works without it.

## 8. Möbius Hub

**Implemented state (HUB-REV, merged 2026-11-15):** the hub is the Celestial Portal. HubNav cards orbit a 2D canvas of celestial rings (`hub/celestialCanvas.ts`, `hub/useCelestialOrbit.ts`), with water-style scene transitions (`shell/useSceneTransition.ts`) and an ambient soundscape (`shell/useCelestialAudio.ts`). It uses no WebGL. The WebGL HubScene and the Möbius ribbon described below are not built; they remain the original HUB-02 plan.

Layers:
1. **HubNav (DOM, always rendered):** `<nav aria-label="Worlds">` with five `<a>` cards. This layer is the accessible navigation and the static-tier layout.
2. **HubScene (lazy WebGL, `aria-hidden`):** the Möbius ribbon, a starfield and lighting. It is never loaded in the static tier.

Scene:
- The ribbon is a custom `BufferGeometry` built from the parametric Möbius equation, with a modest segment count. It uses an emissive material with a fresnel-like rim. Bloom post-processing is off by default and is allowed only in the `full` tier if measurements justify it.
- The starfield is a single `Points` draw call whose count scales with the quality tier.

Cards:
- Cards follow an independent parametric orbit that loosely traces the ribbon centerline. One `requestAnimationFrame` loop projects each card position with the scene camera and writes `style.transform` directly, without a React re-render per frame.
- Because cards are DOM elements, they always face the viewer. Depth is conveyed through scale, opacity and z-index.
- While any card is hovered or focused, the orbit speed eases to 0 and that card is emphasized. Touch: the first tap focuses a card and the second tap enters the world.
- The `static` tier lays the cards out in a fixed ring or grid with no motion.

Quality tiers:
- `static`: used when motion is reduced, WebGL2 is missing, or the user chooses it.
- `lite`: the default for coarse pointers and small screens. DPR is capped at 1, with fewer particles.
- `full`: DPR is capped at 1.5.
- The tier also drops one level automatically if frame time stays high.

Rendering:
- Rendering pauses while `document.hidden` is true.
- The canvas unmounts when a world opens, which frees GPU resources (dispose geometry, materials and textures). Only one WebGL canvas exists at a time.

Pixel reconstruction (HUB-03), DOM-only with no extra GPU work:
- **Trigger:** a card crossing a fixed orbital point (for example the ribbon twist), and the hub entry. At most one card at a time, with a cooldown of several seconds.
- **Never** while a card is hovered or focused, and never in the `static` tier or with reduced motion.
- **Effect:** create a temporary overlay of about 6–12 strips or tiles. Each piece uses the card face image with an offset `background-position`. Hide the real face, animate the pieces with the Web Animations API on `transform` and `opacity` only (staggered, roughly 500–700 ms in total), then remove the overlay. The text label fades instead of fragmenting so it stays crisp and readable.
- If cards ever move into WebGL, the alternative is a per-card fragment shader with a `progress` uniform. This is not part of V1.

Hub ↔ world transitions (Core): the selected card expands or dissolves, the route changes, and the world fades in. Use the View Transitions API where supported and a CSS fade otherwise. With reduced motion, use an instant change or a short crossfade.

## 9. Data organization

- Content lives in `src/worlds/<id>/data/` as typed `.ts` modules (or `.json` with a type). Types live in the world's `types.ts`.
- Missing content uses entries marked with `placeholder: true` so QA can find them.
- Information identity data is copied from `data/Information/mobius_identity_public.json` into the world's `data/`. The raw file stays the source.
- Production entries have `status: 'completed' | 'in-progress' | 'experiment'`. Links and media are optional, and nothing may be marked deployed unless that is verified.

## 10. Asset organization

- `data/` holds raw originals. App code never imports from it. Under P-08:
  - It stays outside Git, and the Lead backs it up separately.
  - Only sanitized public derivatives enter the repository: approved content, private fields removed, image metadata stripped.
- `scripts/optimize-images.mjs` (CORE-03, using `sharp` as a devDependency) converts images:
  - Output is WebP: a full size (long edge at most 1920 px) and a thumbnail (about 480 px).
  - **All metadata is stripped**, including EXIF, GPS and capture dates.
  - Output files get ASCII kebab-case names and are written to `src/worlds/<id>/assets/`.
  - Run `npm run images -- --world <id> [--dir <sub>] [--name <base>] <files|folders>`. The thumbnail is `<name>-thumb.webp` (long edge at most 480 px). Every output is re-read and the run fails if any metadata remains. `npm run images -- --check <paths>` verifies existing images (for QA-04). Usage is documented in the script header.
- Assets are imported through ESM (`import img from './assets/x.webp'`) so Vite fingerprints them. Audio, video and GLB files use `?url` imports and load lazily.
- `public/` holds only files that need stable URLs.
- Each world keeps `assets/CREDITS.md` listing the source and license of any third-party asset. Unlicensed assets are forbidden.

## 11. Performance and accessibility

- **Initial load:** the main bundle holds the shell and HubNav only. `three` and R3F load in the lazy HubScene chunk and in the 3D world chunks that need them, and each world is its own chunk.
- **Images:** use `loading="lazy"`, `decoding="async"` and explicit `width`/`height`. Use thumbnails in grids and full size on demand.
- **GPU:** one active canvas at a time, capped DPR, paused while hidden or offscreen (use IntersectionObserver for canvases inside worlds), and resources disposed on unmount.
- **Mobile:** use the `lite` tier by default and make touch targets at least 44 px.
- **Reduced motion:** follows the system `prefers-reduced-motion` setting. The hub then stops its automatic animation, and worlds must not animate automatically either. There is no in-app toggle (Lead decision, 2026-11-15).
- **Accessibility:** all navigation works with keyboard and touch and without WebGL. Focus styles are visible, text contrast is readable, and `<html lang>` follows the content language.
- **Browsers:** the current evergreen desktop and mobile browsers, including iOS Safari. Without WebGL2 the site uses the static tier.
- **Audio:** no `AudioContext` or playback before a user gesture. Sound is on by default (Lead decision, 2026-11-15): the hub soundscape starts on the visitor's first pointer or key gesture, and the app has no switch to turn it off. The Lead accepted that this does not meet WCAG 1.4.2 (Audio Control). Worlds read the global `sound` setting.
- **Measurement:** no performance numbers are promised. QA-03 measures with Lighthouse (mobile and desktop) and the `vite build` chunk report, then records results in STATUS.

## 12. Deployment

- `npm run build` writes to `dist/`. Cloudflare Pages connects to the Git repository with build command `npm run build` and output directory `dist`.
- **SPA routing:** Cloudflare Pages serves `index.html` for unknown paths when the build has no top-level `404.html`, so the build must not include one. Deep links are verified in DEP-01.
- Branch preview deployments may be used for review.
- There are no environment variables or secrets in V1. The custom domain is not decided.

## 13. Changing shared architecture

Changes to `src/core/`, `src/shared/`, configs, dependencies or this document need an approved change request (see [AGENT_RULES §8](AGENT_RULES.md#8-escalation-and-change-requests)). After GATE-1, a contract change also requires updating every affected world in the same integration step.
