# The Forge

Production owns `/production`, `/production/:slug`, and the fallback for unknown subpaths. `data/projects.ts` is the source of project content, links, gallery media, scene layers, and normalized hotspot positions. A new project needs a data entry and its own permitted assets; the overview and detail components remain shared within this world.

Scene layers use the background's native coordinate system. The map scales one plane containing the background, sprites, and hotspots. Published images live in `assets/chess-ai/`; source material in root `data/` is never imported or committed. See `assets/CREDITS.md` for provenance.

`components/` contains Overview, ProjectDetail, ProjectNotFound, SceneArtwork, Gallery, ServerStatus, ProjectActions, Icon, and health-result validation. `hooks/` contains bounded map navigation and geometry, page focus, scene atmosphere, and the project transition. `types.ts`, `Production.module.css`, `production.test.tsx`, and the existing `index.tsx` / `meta.ts` complete the module.

## Motion and themes

The three sprites bob and tilt at different phases. Translation percentages are derived from each sprite's native dimensions, so their motion scales with the common scene plane. Background and sprite depth respond subtly to the pointer. Dust uses the supplied overlay; ambient glow is restrained. A small shared overscan prevents parallax from exposing scene edges. Mobile and lower quality settings use lighter sources. Reduced motion and static quality preserve the base plus all stationary sprites; the missing original fallback is never requested.

CSS handles ambient motion without React animation updates. Intersection and document visibility pause the scene; pointer easing only schedules frames while settling. Observers, media listeners, events, capture, and frames are cleaned up. The detail body follows the shared day/night palettes while the artwork retains its metallic night setting.

Project-entry links handle the capture phase before the shell's native bubbling transition. Three luminous rings expand from the pointer or keyboard hotspot center; navigation has a fixed 520ms deadline. Reduced motion navigates immediately. Repeated activation, another navigation, history changes, hidden documents, and unmount are handled without leaving pending effects.

## Server availability

No endpoint is configured for Chess AI, so its runtime state is Unknown and no request is sent to the demo server. Development status is separate. To enable monitoring, set `statusEndpoint: { url, service, refreshMs? }` on a project. An HTTPS CORS endpoint must return successful JSON such as `{ "service": "chess-ai", "status": "online" }` or an explicit `offline` result for the matching service. Network failures, blocked private networks, HTTP errors, malformed bodies, and opaque responses remain Unknown. Checks time out after four seconds, refresh at intervals of at least thirty seconds, and stop when the document is hidden.

The owner confirmed `https://admin-linux.tail451544.ts.net/` as the game website. Both Play Game actions open that URL in a new tab. Project feature descriptions follow the desktop repository; the website's feature set is not assumed identical. Owner confirmation of the destination does not replace runtime health monitoring.

## Verification

Phase A: typecheck, 124 tests, and build passed. Browser preview checks covered desktop, 375px touch, keyboard, bounded pan/zoom, direct detail reload, unknown routes, gallery/lightbox controls and focus return, reduced motion, external-link attributes, and the Unknown server badge. No console errors or horizontal overflow were observed.

Phase B: typecheck, 124 tests, build, and the lint invocation below passed. Preview checks covered independent motion, normalized sprite alignment after pan/zoom/resize, pointer parallax, pointer/keyboard ripple origins, double activation, interrupted navigation, offscreen/hidden pause, live reduced-motion changes, mobile touch, gallery loading, and direct route reload. All six themes passed 375px overflow checks; a separate 320px route check also passed. Muted text against the detail background measured at least 5.09:1. No console errors were observed. All eleven published images pass the existing metadata checker. Public demo access and current gameplay screenshots remain unverified / unavailable.

`npm run lint` fails on 1,010 pre-existing errors in the untracked generated `prototypes/information/dist/` output. `npm run lint -- --ignore-pattern 'prototypes/information/dist/**'` passes. Core must decide whether to exclude that generated directory; this world does not change root lint configuration or remove another owner's files.
