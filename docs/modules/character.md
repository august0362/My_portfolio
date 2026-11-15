# World: Character (Astral Codex)

ID `character` · Route `/character` · Owner: Character agent

## Purpose and scope

Displays original fantasy and celestial character designs. The aesthetic is anime fantasy RPG, ethereal, ornamental and Xianxia-inspired.

Genshin Impact and Wuthering Waves are mood references only. **Do not copy** their characters, art, logos or assets.

## Confirmed content

No character data has been supplied yet.

## V1 deliverables

| Task | Deliverable | Acceptance |
|---|---|---|
| CHAR-01 | Gallery at `/character` and a detail route `/character/:slug`, typed extensible metadata, 2–3 clearly labeled placeholder entries | Adding a character requires only a data entry. Placeholders contain no invented lore. Gallery works with keyboard. Images lazy-load |

## Deferred

Full lore pages, character comparisons, 3D model viewers, animated splash art.

## Module architecture

Schema in `types.ts`:

```ts
{
  slug, name, title?, element?, summary?,
  images: [{ src, alt, kind: 'concept' | 'portrait' | 'full' }],
  tags?, placeholder?
}
```

- Optional fields stay empty until the Lead supplies them.
- `data/characters.ts` holds the entries and `assets/<slug>/` holds the images.
- See the minimal module example in [ARCHITECTURE §6](../ARCHITECTURE.md#6-example-minimal-world-module).

## Owned paths

`src/worlds/character/**`

## Shared dependencies

`@shared/contract`, `@shared/settings`, `@shared/tokens.css`, React Router.

## Missing assets/data

- Character designs.
- Names and descriptions.
- Concept art, with confirmed ownership or license.

## Current verified state

Not started (2026-11-15).
