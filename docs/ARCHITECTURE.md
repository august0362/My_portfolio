# Architecture

Status: the direction is **CONFIRMED** (P-01–P-17). Implementation state is in [STATUS.md](STATUS.md). The module contract (§5) is frozen as v1 since GATE-1 (Lead, 2026-11-15). Decision IDs (P-xx) refer to [CONTEXT §4](CONTEXT.md#4-architecture-decisions).

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
vite.config.ts, tsconfig.json, eslint.config.js, run.bat   Core
public/                    Core: stable-URL files only (none yet)
scripts/                   Core: build-time tools (image optimizer)
data/                      Raw source material. Never imported by app code (P-08)
docs/                      See AGENT_RULES §2 for edit rights
src/
  main.tsx                 Core
  core/                    Core: App (router), registry, hub, shell
    registry.ts
    shell/                 AppShell, WorldFrame, BackToHub, 404, settings panel, transitions, audio
    hub/                   HubNav (DOM cards), 2D celestial canvas and orbit
  shared/                  Core-owned; the ONLY internal code worlds may import
    contract.ts            WorldId, WorldMeta, WorldDefinition
    settings.tsx           SettingsProvider + useSettings (motion, quality, sound, appearance, palette)
    tokens.css             Design tokens
  worlds/
    information/           Information agent
    production/            Production agent
    character/             Character agent
    wanderlight/           Wanderlight agent
    ethereal/              Ethereal agent
```

Each world folder holds `meta.ts`, `index.tsx` and any of `components/`, `data/`, `assets/`, `types.ts` and `*.module.css`. A shared UI primitive goes into `src/shared/` only when two or more worlds need it.

## 3. Boundaries and import rules

```text
main.tsx ──► core/ ──► worlds/<id>/meta.ts      (static import, tiny)
                 └───► worlds/<id>/index.tsx     (lazy import only)
core/      ──► shared/
worlds/<id>/** ──► shared/**  and npm packages
worlds/<a>/**  ──✕──► worlds/<b>/**, core/**
shared/**      ──✕──► core/**, worlds/**
```

- ESLint (`import-x/no-restricted-paths` with the TypeScript resolver, in `eslint.config.js`) enforces these rules for **both** alias imports (`@core/*`, `@shared/*`, `@worlds/*`) and relative imports (for example `../production/x`).
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

The contract is Core-owned. **Contract v1 is frozen** since GATE-1 (Lead, 2026-11-15). Any change now needs a Core change request and an update to every affected world in the same integration step ([§13](#13-changing-shared-architecture)).

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

- `WorldFrame` wraps every world. It renders a "Return to the Portal" control that is always visible and is the first keyboard stop. It also sets `document.title`, moves focus to the world's `<main>` after navigation, and shows a `Suspense` loading state.
- An `ErrorBoundary` around each world shows a message with **Retry** and a way back to the Portal, so a crashing world never breaks the shell or the hub.
- Lazy components are created once per world from `load()`. Hovering or focusing a hub card calls `load()` to prefetch the world.
- Settings (`shared/settings.tsx`), per the Lead decision of 2026-11-15 ([P-13](CONTEXT.md#4-architecture-decisions)):
  - `motion: 'full' | 'reduced'` follows `prefers-reduced-motion` only.
  - `quality: 'full' | 'lite' | 'static'` starts at `full`.
  - `sound: boolean` defaults to `true`.
  - `appearance: 'dark' | 'light'` defaults to `dark` and does not follow the browser colour scheme.
  - `palette: 'iris' | 'sakura' | 'jade' | 'pearl' | 'dream'` defaults to `iris` (P-17). Retired values migrate: moonlit → iris, rosewater → sakura, tidal → jade, lagoon → dream.
  - `language: 'en' | 'vi'` defaults to the browser language and sets `<html lang>` (P-17).
- Core renders the settings control (the Atmosphere panel). Only `appearance`, `palette` and `language` can be chosen there (language beside the Atmosphere button) and restored from `localStorage`; saved `motion`, `quality` and `sound` values are ignored. Storage uses try/catch, and the app works without it.
- Paired themes ([P-16](CONTEXT.md#4-architecture-decisions)): the Atmosphere panel is the only color control, and it stays visible in worlds. Each world reads `appearance` and `palette` from `useSettings()`, renders light or dark to match, and maps each of the five palettes to one paired world theme (for example Information's `PAIRED_THEMES` in `theme.config.ts`). Worlds do not add their own palette or light/dark controls.
- Languages ([P-17](CONTEXT.md#4-architecture-decisions)): `@shared/i18n` provides `Localized<T>` (`{ en, vi }`), `useLanguage()` and `useCopy(dictionary)`. Core keeps its copy and the hub names of the worlds in `core/copy.ts`; each world keeps its own copy and content translations (for example `data/locale.ts`). Approved originals are never edited to translate them. A language switch must not move focus or scroll.

## 8. Hub (Celestial Portal)

The hub is the 2D Celestial Portal from HUB-REV ([P-14](CONTEXT.md#4-architecture-decisions)). There is no WebGL hub scene, Möbius ribbon or pixel reconstruction effect.

- **HubNav (DOM, always rendered):** five `<a>` cards inside the hub `<main>`. This layer is the accessible navigation.
- **Decoration:** a 2D canvas of celestial rings (`hub/celestialCanvas.ts`, `hub/useCelestialOrbit.ts`), hidden from assistive technology. It uses no WebGL. Cards orbit it, and the nearest card stays above the core.
- **Motion:** the orbit and canvas animation stop under reduced motion (`settings.motion`, which follows the system setting, P-13).
- **Sound:** an ambient soundscape (`shell/useCelestialAudio.ts`), on by default (P-13).

Page transitions (HUB-03, P-17, Core): `shell/useSceneTransition.ts`. A celestial veil closes from the pressed link, the route changes, and the new page opens through it; a hub card also lifts and dissolves first. With reduced motion the change is instant. Navigation never waits on a transition.

World routes are full-bleed (P-15): `AppShell` drops the content column and the brand header, and `BackToHub` floats top-left. Placeholder worlds (`[data-placeholder]`) keep a readable column.

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

- **Initial load:** the main bundle holds the shell and HubNav only. `three` and R3F load only in the 3D world chunks that need them, and each world is its own chunk.
- **Images:** use `loading="lazy"`, `decoding="async"` and explicit `width`/`height`. Use thumbnails in grids and full size on demand.
- **GPU:** one active canvas at a time, capped DPR, paused while hidden or offscreen (use IntersectionObserver for canvases inside worlds), and resources disposed on unmount.
- **Mobile:** touch targets are at least 44 px. Quality starts at `full` (P-13), so 3D worlds must still stay usable on weak phones.
- **Reduced motion:** follows the system `prefers-reduced-motion` setting. The hub then stops its automatic animation, and worlds must not animate automatically either. There is no in-app toggle (Lead decision, 2026-11-15).
- **Accessibility:** all navigation works with keyboard and touch and without WebGL. Focus styles are visible, text contrast is readable, and `<html lang>` follows the content language.
- **Browsers:** the current evergreen desktop and mobile browsers, including iOS Safari. Without WebGL2, 3D worlds fall back to a static view.
- **Audio:** no `AudioContext` or playback before a user gesture. Sound is on by default (Lead decision, 2026-11-15): the hub soundscape starts on the visitor's first pointer or key gesture, and the app has no switch to turn it off. The Lead accepted that this does not meet WCAG 1.4.2 (Audio Control). Worlds read the global `sound` setting.
- **Measurement:** no performance numbers are promised. QA-03 measures with Lighthouse (mobile and desktop) and the `vite build` chunk report, then records results in STATUS.

## 12. Deployment

- `npm run build` writes to `dist/`. Cloudflare Pages connects to the Git repository with build command `npm run build` and output directory `dist`.
- **SPA routing:** Cloudflare Pages serves `index.html` for unknown paths when the build has no top-level `404.html`, so the build must not include one. Deep links are verified in DEP-01.
- Branch preview deployments may be used for review.
- There are no environment variables or secrets in V1. The custom domain is not decided.

## 13. Changing shared architecture

Changes to `src/core/`, `src/shared/`, configs, dependencies or this document need an approved change request (see [AGENT_RULES §8](AGENT_RULES.md#8-escalation-and-change-requests)). After GATE-1, a contract change also requires updating every affected world in the same integration step.
