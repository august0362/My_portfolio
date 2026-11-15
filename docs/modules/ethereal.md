# World: Ethereal

ID `ethereal` · Route `/ethereal` · Owner: Ethereal agent

## Purpose and scope

An immersive audiovisual space for contemplation: animated celestial landscapes, atmospheric lighting, ambient sound and a minimal interface. V1 is **one polished scene** with a small set of interactions.

## Confirmed content

Only the purpose and the V1 scope above are confirmed. The scene theme and audio are not decided.

## V1 deliverables

| Task | Deliverable | Acceptance |
|---|---|---|
| ETH-01 | One scene, 2–3 gentle interactions (for example pointer-driven light or drifting particles), audio controls (play/mute, volume) wired to the global `sound` setting, silent or placeholder audio | Nothing is audible before a user gesture. Rendering pauses when hidden or offscreen and stops on exit. Reduced motion shows a calm static or slow version. Lite tier lowers cost. No console errors |
| ETH-02 | Licensed or original ambient audio | License recorded in `assets/CREDITS.md`. Audio lazy-loaded through a `?url` import |

## Deferred

Multiple scenes, scene switching, day/night cycles, music playlists, video backgrounds.

## Module architecture

- The rendering approach is chosen in ETH-01 from the shared stack: R3F/three, or a single fragment shader / Canvas 2D if lighter.
- Heavy post-processing needs a measured justification.
- Audio uses one `HTMLAudioElement` or `AudioContext`, created on the first user gesture.

## Owned paths

`src/worlds/ethereal/**`

## Shared dependencies

- `@shared/contract`, `@shared/settings` (motion, quality, sound, and appearance + palette for colors, P-16), `@shared/tokens.css`.
- `three`/R3F if chosen.

## Missing assets/data

- The scene theme approval.
- Ambient audio with its license.
- Any textures.

## Current verified state

Not started (2026-11-15).
