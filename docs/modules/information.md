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
| INFO-01 | Identity, Knowledge & Skills (category groups, no percentage bars), Resume & Connect | Text matches the JSON exactly. Skills come only from the Lead-confirmed list. The public CV is an HTML sheet with no phone and no file link (P-15). Links open correctly |
| INFO-02 | My Journey: celestial timeline component with entries (`period`, `title`, `description`, optional `image`) | Renders placeholder entries clearly marked as placeholders. Keyboard accessible. Static under reduced motion |
| INFO-03 | Fragments of Me: albums → photo grid → enlarged view | Images come only from CORE-03 output with metadata stripped. Thumbnails in the grid. Lazy loading. Lightbox works with keyboard and Esc. No dates shown for the Birthday album |

## Deferred

Sub-routes per section, album filtering, captions in multiple languages, animated constellation backgrounds beyond a light CSS or SVG effect.

## Module architecture

- `data/identity.ts` (copied from the raw JSON), `data/journey.ts`, `data/albums.ts`, `data/skills.ts`, `data/cv.ts`.
- `theme.config.ts` holds every color: five themes from the owner's moodboards and `PAIRED_THEMES` (P-16, P-17). `theme.ts` derives dark mode and enforces WCAG AA contrast.
- `data/locale.ts` holds the interface copy and the translations (P-17): English for the Vietnamese bio, journey and personal lists; Vietnamese for the English headline, role, CV and album text. The originals stay untouched.
- `components/` holds one component per section.
- `assets/photos/<album>/` holds the optimized images and `assets/CREDITS.md` records their provenance.
- No WebGL. Celestial accents are CSS or SVG. The hero orbit rings are SVG paths projected each frame from two 3D circles (`components/orbit.ts`, `Orbit3D.tsx`).
- `sensor.ts` gives one smoothed tilt signal (pointer on desktop, device orientation on phones, iOS asks on first tap). It tilts the portrait, its rings and the CV sheet. Off under reduced motion.
- `components/CvSheet.tsx` renders the public CV from `data/cv.ts` as HTML.

## Owned paths

`src/worlds/information/**`

## Shared dependencies

`@shared/contract`, `@shared/settings` (motion, appearance, palette), `@shared/tokens.css`, React Router, and the CORE-03 image script, which Core runs or the agent runs without modifying it.

## Missing assets/data

Missing: a portrait, milestone images, photo captions, and the site language decision.

Settled by the Lead (2026-11-15):
- Journey: four chapters, 2024 → present, with GPA notes. Skills: the four professional fields from the identity JSON.
- Public CV: an HTML sheet transcribed from `data/CV/CV.pdf` without the phone number; no file is linked or shipped. `SHOW_GRADES` in `data/cv.ts` hides GPA and grades. The CV's technical skills appear only in that sheet.
- Albums (P-09): 16 metadata-free WebP photos (2048 px + 1024 px thumbnail; a test checks each has only the `VP8 ` chunk). The fourth `Cosplay Festival` photo is left out (third-party shop sign), and no photographer credit is shown. Provenance is in `assets/CREDITS.md`.
- Album dates: Studio Photography 2026-06-06, Cosplay Collection 2025-12-28. Life Moments shows the year 2024 only, because the day and month would reveal the private date of birth.

## Current verified state

INFO-01..03 integrated from the Chronicle prototype (2026-11-15, P-15). Colors follow the Atmosphere panel (P-16, P-17): Iris → 01 Iris Reverie, Sakura → 02 Sakura Haze, Jade → 03 Jade Silk, Pearl → 04 Pearl Dew, Lagoon → 05 Pink Lagoon, light or dark per `appearance`. Copy follows `settings.language`. The section index has a gliding marker and a light sweep on arrival; album tabs hand over their line and slide the new album in. Verification is in [STATUS.md](../STATUS.md).
