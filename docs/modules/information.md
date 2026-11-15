# World: Information (Chronicle)

ID `information` · Route `/information` · Owner: Information agent

## Purpose and scope

Presents the creator's identity, life journey, photos, skills and resume. V1 is a single page with these sections in order: Identity → My Journey → Fragments of Me → Knowledge & Skills → Resume & Connect.

## Confirmed content

- **Identity:** use [data/Information/mobius_identity_public.json](../../data/Information/mobius_identity_public.json) as-is. Keep the bio in Vietnamese. The JSON has `motto`, `portrait` and `linkedin` set to `null`, so render nothing for those fields.
- **Contacts:** GitHub, Facebook and email, all taken from the JSON.
- **Privacy:** never show the date of birth. Do not use the CV's phone number unless the Lead explicitly approves it.

## V1 deliverables

| Task | Deliverable | Acceptance |
|---|---|---|
| INFO-01 | Identity, Knowledge & Skills (category groups, no percentage bars), Resume & Connect | Text matches the JSON exactly. Skills come only from the Lead-confirmed list. The CV link appears only once a public CV file exists. Links open correctly |
| INFO-02 | My Journey: celestial timeline component with entries (`period`, `title`, `description`, optional `image`) | Renders placeholder entries clearly marked as placeholders. Keyboard accessible. Static under reduced motion |
| INFO-03 | Fragments of Me: albums → photo grid → enlarged view | Images come only from CORE-03 output with metadata stripped. Thumbnails in the grid. Lazy loading. Lightbox works with keyboard and Esc. No dates shown for the Birthday album |

## Deferred

Sub-routes per section, album filtering, captions in multiple languages, animated constellation backgrounds beyond a light CSS or SVG effect.

## Module architecture

- `data/identity.json`, copied from the raw file.
- `data/journey.ts`, `data/albums.ts`, `data/skills.ts`.
- `components/` holds one component per section.
- `assets/photos/<album>/` holds the optimized images and `assets/CREDITS.md` lists credits.
- No 3D is needed. Use CSS or SVG for celestial accents.

## Owned paths

`src/worlds/information/**`

## Shared dependencies

`@shared/contract`, `@shared/settings` (motion), `@shared/tokens.css`, React Router, and the CORE-03 image script, which Core runs or the agent runs without modifying it.

## Missing assets/data

- Journey milestones and dates.
- The confirmed skills list. `data/CV/CV.pdf` has a candidate list.
- A public CV file without the phone number, with the Lead deciding on GPA and coursework.
- A portrait.
- Photo captions.
- Lead confirmation of the album mapping P-09 (DEFERRED; blocks INFO-03 only). Raw photos: `Tiên hiệp` (8), `Cosplay Festival` (4, 6–11 MB each), `Birthday` (5).
- The site language decision.

## Current verified state

Not started (2026-11-15). Only raw files exist in `data/`.
