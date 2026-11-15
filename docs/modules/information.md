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
- `assets/photos/<album>/` holds the optimized images and `assets/CREDITS.md` records their provenance.
- No WebGL. Celestial accents are CSS or SVG. The hero orbit rings are SVG paths projected each frame from two 3D circles (`components/orbit.ts`, `Orbit3D.tsx`).
- `sensor.ts` gives one smoothed tilt signal (pointer on desktop, device orientation on phones, iOS asks on first tap). It tilts the portrait, its rings and the CV sheet. Off under reduced motion.
- `data/cv.ts` and `components/CvSheet.tsx` render the public CV as HTML.

## Owned paths

`src/worlds/information/**`

## Shared dependencies

`@shared/contract`, `@shared/settings` (motion, appearance, palette), `@shared/tokens.css`, React Router, and the CORE-03 image script, which Core runs or the agent runs without modifying it.

## Missing assets/data

- Journey milestones: SUPPLIED by the Lead (2026-11-15), four chapters 2024 → present with GPA notes. Milestone images are still missing.
- Skills list: CONFIRMED by the Lead (2026-11-15) as the four professional fields from the identity JSON.
- Public CV: SHOWN at the Lead's request (2026-11-15) as an HTML sheet in Resume & Connect, transcribed verbatim from `data/CV/CV.pdf` without the phone number. No CV file is linked or shipped. GPA and course grades are shown; `SHOW_GRADES` in `data/cv.ts` hides them. The CV's technical skills appear only inside that sheet, not in Knowledge & Skills.
- A portrait.
- Photo captions.
- Album mapping P-09 CONFIRMED by the Lead (2026-11-15): `Tiên hiệp` → Studio Photography, `Cosplay Festival` → Cosplay Collection, `Birthday` → Life Moments. 16 photos ADDED to the prototype at the Lead's request (2026-11-15) as metadata-free WebP (2048 px plus a 1024 px thumbnail), made by a stopgap Chrome re-encode before CORE-03 existed and accepted as is (P-15); a test checks every file has only the `VP8 ` chunk. Provenance and review notes are in `src/worlds/information/assets/CREDITS.md`. The fourth `Cosplay Festival` photo is left out (third-party shop sign) and no photographer credit is shown (Lead decisions, 2026-11-15). Raw photos: `Tiên hiệp` (8), `Cosplay Festival` (4, 6–11 MB each), `Birthday` (5).
- Album shoot dates (Lead, 2026-11-15): Studio Photography 2026-06-06; Cosplay Collection 2025-12-28. Life Moments shows the year 2024 only, because its source folder is a birthday shoot and the day and month would reveal the private date of birth.
- The site language decision.

## Current verified state

INFO-01, INFO-02 and INFO-03 integrated from the Chronicle prototype (2026-11-15, P-15). The world root is a `<div>` inside WorldFrame's `<main>`; reduced motion comes from `useSettings()`; `meta.ts` is static so the main chunk stays small. Colors follow the site's Atmosphere panel (P-16): `appearance` sets light or dark, and `PAIRED_THEMES` in `theme.config.ts` maps Moonlit → 01 Chronicle, Rosewater → 02 Cotton Sky, Tidal → 03 Muted Summer. The prototype's own theme picker and light/dark toggle were removed; themes 04–06 stay in the config for re-pairing. Verification is in [STATUS.md](../STATUS.md).
