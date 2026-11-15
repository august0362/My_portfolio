# World: Wanderlight

ID `wanderlight` · Route `/wanderlight` · Owner: Wanderlight agent

## Purpose and scope

A small, relaxing, browser-based exploration game built around peaceful movement, discovery, light interactions and environmental storytelling. It has no competition and needs no backend.

V1 is **one small explorable scene**, possibly a celestial garden or dreamlike space.

## Confirmed content

Only the purpose and the V1 scope above are confirmed. The mechanics need Lead approval.

## V1 deliverables

| Task | Deliverable | Acceptance |
|---|---|---|
| WAND-01 | Design note added to this doc: setting, controls (keyboard, touch), 3–5 discoverable interactions, art approach, rendering approach (Canvas 2D or R3F, chosen from shared deps; no game engine) | Lead approves it. No code |
| WAND-02 | Playable scene per WAND-01 | Playable with keyboard and touch. Pauses when the tab is hidden. Reduced motion respected. Stable frame rate on a mid-range phone (measured and reported). Resources disposed on exit. No console errors |

## Deferred

Progression systems, saves, multiplayer, accounts, multiple scenes, procedural worlds.

## Module architecture

Not decided until WAND-01. Constraints:
- Stop the game loop on unmount and while hidden.
- Use no globally captured keys outside the canvas focus, so the shell's back-to-hub control stays reachable.
- Keep assets in `assets/` with `CREDITS.md`.

## Owned paths

`src/worlds/wanderlight/**`

## Shared dependencies

- `@shared/contract`, `@shared/settings` (motion, quality, sound, and appearance + palette for colors, P-16; language for copy, P-17), `@shared/tokens.css`.
- `three`/R3F if chosen. Any other library needs a change request.

## Missing assets/data

Approved mechanics, art direction and any sprites, models or audio.

## Current verified state

Not started (2026-11-15).
