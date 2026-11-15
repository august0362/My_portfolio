# The Forge

Production owns `/production`, `/production/:slug`, and the fallback for unknown subpaths. `data/projects.ts` is the source of project content, links, gallery media, scene layers, and normalized hotspot positions. A new project needs a data entry and its own permitted assets; the overview and detail components remain shared within this world.

Scene layers use the background's native coordinate system. The map scales one plane containing the background, sprites, and atmospheric effects. Project hotspot coordinates recenter the scene when a destination is selected. The centered project board links to the detail route. Published images live in `assets/chess-ai/`; source material in root `data/` is never imported or committed. See `assets/CREDITS.md` for provenance.

`components/` contains Overview, ProjectDetail, ProjectNotFound, SceneArtwork, Gallery, ServerStatus, ProjectActions, ForgeCrest, Icon, and health-result validation. `hooks/` contains bounded map navigation and geometry, page focus, scene atmosphere, and the project transition. `effects/atmosphereCanvas.ts` owns the bounded particle and water field. `Atlas.module.css` styles the full-screen destination view and floating detail document; `Production.module.css` styles shared world content and artwork.

## Motion and themes

The three sprites bob and tilt at different phases using the manifest's suggested amplitudes. Translation percentages are derived from each sprite's native dimensions, so their motion scales with the common scene plane. Slow camera drift moves the common composition; background and sprite depth respond differently to the pointer. Dust uses the supplied overlay. Canvas adds foreground motes, passing light, reflective-floor caustics, and pointer water pulses. A shared overscan prevents camera movement from exposing scene edges. Mobile and lower quality settings use lighter sources. Reduced motion and static quality preserve the base plus all stationary sprites; the missing original fallback is never requested.

One animation loop paints the active scene without React animation updates. Canvas resolution is capped at 2,200 pixels wide and DPR 1.5; the water field retains at most six pulses. Intersection and document visibility pause both Canvas and CSS animation. Identical pointer values are not rewritten to styles. Observers, media listeners, events, capture, and frames are cleaned up. The floating detail document follows the shared day/night palettes while its fixed artwork backdrop retains the metallic night setting.

Project-entry links handle the capture phase before the shell's native bubbling transition. Three luminous rings and a refracting water lens expand from the pointer or keyboard link center; navigation has a fixed 680ms deadline. The project board fades and blurs while entering the floating detail document. Reduced motion navigates immediately. Repeated activation, another navigation, history changes, hidden documents, and unmount are handled without leaving pending effects.

The overview follows the presentation structure of the owner's Genshin map reference: a full-screen environment, centered crest/title/description, an entry control below, and a right-side destination rail. These are original CSS/SVG components using the supplied Chess AI artwork. No source code or proprietary assets from the reference are shipped. Dragging the environment blurs and recedes the central board; pointer and keyboard focus restore clarity. Compact mobile layouts omit the redundant single-destination rail while retaining scene reset and the project link.

## Color stories and languages

`Theme.module.css` is the color source for this world. It follows the site's five color stories (P-17), each with Midnight and Daylight surfaces, all drawn from the owner's moodboards in `data/Image/Theme/`:

| Palette | Reference colors |
| --- | --- |
| Iris | `#C7C6DF`, `#6F6D97`, `#383B67`, `#BACBFE`, `#EFE2FA` |
| Sakura | `#F4C9DA`, `#FEE3EC`, `#C87377`, `#A77370`, `#B1BEF2` |
| Jade | `#0D3021`, `#406250`, `#8AACA0`, `#BEDBD3` |
| Pearl | `#E9D8C6`, `#DDBDA5`, `#A37E66`, `#8C7466`, `#BCAEC4` |
| Lagoon | `#6BB1AD`, `#A7BCBD`, `#EDECDB`, `#E5A9A9`, `#E6748E` |

Surfaces, controls, lines, scene tint, light, particles and water share these tokens; Canvas reads them when palette or appearance changes. Reference photographs stay read-only and are never imported. Copy follows `settings.language`: `data/locale.ts` holds the interface strings and the Vietnamese project text, while `data/projects.ts` stays the English source.

## Scene motion

Canvas paints two aurora ribbons, 150 drifting motes (80 on lighter quality) with twinkling sparkles, rising embers, swaying floor caustics, a shooting star every couple of seconds and a quiet floor ripple every few seconds, plus pointer ripples. CSS adds a stronger camera drift, livelier piece floats, faster dust, swinging light shafts and a passing sheen. Everything pauses offscreen or in a hidden tab, and reduced motion or static quality keeps the still artwork.

## Server availability

Chess AI sets `statusEndpoint` to `https://admin-linux.tail451544.ts.net/health`. A static site can only read another origin's status through CORS, so the game proxy must answer that route itself (before forwarding to the game) with JSON `{ "service": "chess-ai", "status": "online" | "offline" }` and `Access-Control-Allow-Origin: *`. Until it does, the badge shows "Status unavailable" with a "Check again" button. Network failures, HTTP errors, malformed bodies and opaque responses never claim a state. Checks time out after four seconds, refresh every minute, and stop when the tab is hidden.

The hero offers only Play Game; the GitHub source link sits in the page footer.

## Verification

Phase A: typecheck, 124 tests, and build passed. Browser preview checks covered desktop, 375px touch, keyboard, bounded pan/zoom, direct detail reload, unknown routes, gallery/lightbox controls and focus return, reduced motion, external-link attributes, and the Unknown server badge. No console errors or horizontal overflow were observed.

Phase B: typecheck, 124 tests, build, and the lint invocation below passed. Preview checks covered independent motion, normalized sprite alignment after pan/zoom/resize, pointer parallax, pointer/keyboard ripple origins, double activation, interrupted navigation, offscreen/hidden pause, live reduced-motion changes, mobile touch, gallery loading, and direct route reload. All six themes passed 375px overflow checks; a separate 320px route check also passed. Muted text against the detail background measured at least 5.09:1. No console errors were observed. All eleven published images pass the existing metadata checker. Public demo access and current gameplay screenshots remain unverified / unavailable.

`npm run lint` fails on 1,010 pre-existing errors in the untracked generated `prototypes/information/dist/` output. `npm run lint -- --ignore-pattern 'prototypes/information/dist/**'` passes. Core must decide whether to exclude that generated directory; this world does not change root lint configuration or remove another owner's files.

PROD-REV-01 replaces the earlier overview and hero layout. Typecheck, 130 tests, build, and lint excluding the generated prototype pass. New tests cover bounded water input, normalized particles, one active animation loop, hidden/offscreen pause and resume, resource cleanup, reduced/static motion, and missing Canvas. The earlier Phase A/B browser checks describe the earlier layout. Visual browser verification of this revision remains pending: Computer Use stopped because URL policy enforcement is unsupported for the current Windows Cốc Cốc browser. The reference structure was inspected through its public HTML and stylesheet response instead.

PROD-REV-02: typecheck, 136 tests, build, and lint excluding the generated prototype pass. Six color contrast tests cover text, secondary text, buttons, focus accents, and glass composited over extreme light/dark backgrounds. The minimum secondary-text ratio is 4.60:1 and the minimum button ratio is 4.79:1. A separate palette sheet was rendered from the CSS values for visual color review; this does not replace live browser layout verification.

REDESIGN-01: typecheck, lint, 148 tests and build pass. Headless Chrome screenshots of the overview and detail at 1440 and 375 px, in both languages and several palettes, showed no console errors and no horizontal overflow.
