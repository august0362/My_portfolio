# The Forge

Production owns `/production`, `/production/:slug`, and the fallback for unknown subpaths. `data/projects.ts` is the source of project content, links, gallery media, scene layers, and normalized hotspot positions. A new project needs a data entry and its own permitted assets; the overview and detail components remain shared within this world.

Scene layers use the background's native coordinate system. The map scales one plane containing the background, sprites, and hotspots. Published images live in `assets/chess-ai/`; source material in root `data/` is never imported or committed. See `assets/CREDITS.md` for provenance.

## Server availability

No endpoint is configured for Chess AI, so its runtime state is Unknown and no request is sent to the demo server. Development status is separate. To enable monitoring, set `statusEndpoint: { url, service, refreshMs? }` on a project. An HTTPS CORS endpoint must return successful JSON such as `{ "service": "chess-ai", "status": "online" }` or an explicit `offline` result for the matching service. Network failures, blocked private networks, HTTP errors, malformed bodies, and opaque responses remain Unknown. Checks time out after four seconds, refresh at intervals of at least thirty seconds, and stop when the document is hidden.

## Verification

Phase A: typecheck, 124 tests, and build passed. Browser preview checks covered desktop, 375px touch, keyboard, bounded pan/zoom, direct detail reload, unknown routes, gallery/lightbox controls and focus return, reduced motion, external-link attributes, and the Unknown server badge. No console errors or horizontal overflow were observed.

`npm run lint` fails on 1,010 pre-existing errors in the untracked generated `prototypes/information/dist/` output. `npm run lint -- --ignore-pattern 'prototypes/information/dist/**'` passes. Core must decide whether to exclude that generated directory; this world does not change root lint configuration or remove another owner's files.
