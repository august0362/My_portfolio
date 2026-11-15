# Context: source of truth for product decisions

Status labels:
- **CONFIRMED**: decided by the Engineering Lead.
- **PROPOSED**: recommended by the architect and awaiting Lead approval.
- **DEFERRED**: the Lead postponed the decision. It blocks only the tasks listed with it.
- **NOT YET DECIDED**: open.
- **VERIFIED**: checked in the repository.

Record each decision once, here. Other docs link to this file.

## 1. Vision (CONFIRMED)

Möbius Universe is the creator's interactive personal universe, made of interconnected worlds rather than a conventional portfolio. It covers software engineering, AI, cloud, game development, fantasy and celestial art, personal storytelling and relaxing interactive experiences.

## 2. Product constraints (CONFIRMED)

- The site is public, static and read-only. There is no server-side user data, no accounts and no content editing UI. Browser-side navigation, games, animations and temporary state are allowed.
- There is no backend, database, auth, CMS or mandatory VPS, and basic availability must not depend on the creator's machine.
- Content updates go through Git, and assets must be delivered efficiently.
- A future server-side project may link to a separately deployed service. The portfolio must not depend on it.
- The homepage is the Möbius Hub: a 3D Möbius ribbon with five orbiting world cards, hover/focus stabilization, click to enter, smooth transitions and a reliable return to the hub. The hub must work without 3D, with keyboard and touch, with reduced motion, and on weak devices.
- The pixel reconstruction effect (fragment, shift, reassemble) is an occasional controlled transition, not a constant animation.
- Five worlds with fixed IDs and routes: `information`, `production`, `character`, `wanderlight`, `ethereal`, each served at `/<id>`.
- The shared style is Ethereal Celestial Fantasy. Each world may have its own visual identity under the shared navigation.
- AI agent ownership model: see [AGENT_RULES.md](AGENT_RULES.md).

## 3. Identity content (CONFIRMED)

- The approved public identity data lives in [data/Information/mobius_identity_public.json](../data/Information/mobius_identity_public.json). That file is the single source for name, display name, role, education, headline, Vietnamese bio, fields, interests, goal, personality, visual styles and public contacts (GitHub, Facebook, email).
- LinkedIn and the personal motto are not provided (`null`), and the portrait is not provided (`null`).
- **Private:** the date of birth must never appear in site content, data, metadata or docs. The CV also contains a phone number, which is treated as private until the Lead approves publishing it.

## 4. Architecture decisions

Lead review on 2026-11-15: P-01–P-08, P-10 and P-11 are CONFIRMED. P-09 is DEFERRED.

| ID | Status | Decision | Rationale |
|---|---|---|---|
| P-01 | CONFIRMED | React + TypeScript + Vite, with versions pinned in CORE-01 | Static SPA, fast build, familiar to agents |
| P-02 | CONFIRMED | React Router (declarative mode) for client routing | Nested world routes and deep links with one small dependency |
| P-03 | CONFIRMED | `three` + `@react-three/fiber` for 3D. Add `@react-three/drei` only when a specific helper is needed | One 3D stack shared by the hub and any 3D world |
| P-04 | CONFIRMED | Plain CSS: global tokens as CSS custom properties, CSS Modules for components | Zero extra dependencies, and no class collisions between worlds |
| P-05 | CONFIRMED | ESLint (with an import-boundary rule) + Vitest for contract and data tests. The boundary rule must catch both alias and relative imports ([ARCHITECTURE §3](ARCHITECTURE.md#3-boundaries-and-import-rules)) | Enforces module isolation cheaply |
| P-06 | CONFIRMED | Cloudflare Pages static hosting with SPA fallback | Free static hosting, Git-based deploys, branch previews |
| P-07 | CONFIRMED | Layout, module contract and registry as in [ARCHITECTURE.md](ARCHITECTURE.md). This confirms the direction only. The contract is frozen at GATE-1 | Lets five worlds be built in parallel |
| P-08 | CONFIRMED | Raw `data/` stays outside Git (`.gitignore`). The Lead backs it up separately. Only sanitized public derivatives enter the repository: approved content, private fields removed, image metadata stripped | Raw photos are 1.4–11 MB each, and the CV contains private fields |
| P-09 | DEFERRED | Candidate photo album mapping: `Tiên hiệp` → Studio Photography, `Cosplay Festival` → Cosplay Collection, `Birthday` → Life Moments. Waiting for the Lead to confirm the mapping. Blocks INFO-03 only | Matches the existing folders to the brief's album categories |
| P-10 | CONFIRMED | Hub cards are HTML links positioned over a WebGL Möbius ribbon | Readable, accessible, focusable, and keeps a no-3D fallback |
| P-11 | CONFIRMED | npm as the package manager | Default, no extra tooling |
| P-12 | CONFIRMED | The public name is **Celestial Portal**, used in the page title and the launcher. "Möbius Universe" stays the internal project name (repository, package, docs) | Lead decision, 2026-11-15 (HUB-REV) |
| P-13 | CONFIRMED | Hub settings follow HUB-REV: visitors choose only appearance (dark or light) and palette. Sound is on by default with no off switch. Motion follows the system setting. Quality starts at full ([ARCHITECTURE §7](ARCHITECTURE.md#7-shell-behavior-core), [§11](ARCHITECTURE.md#11-performance-and-accessibility)) | Lead decision, 2026-11-15. Replaces the earlier rule that sound stays off and motion can be toggled in the app |

## 5. Not yet decided

- **Site language:** Vietnamese, English or bilingual UI. The bio is Vietnamese, the headline is English, and the JSON lists interests in Vietnamese while the brief lists them in English.
- **My Journey:** milestones and dates.
- **Knowledge & Skills:** the final list to publish. `data/CV/CV.pdf` has a candidate list that needs Lead confirmation.
- **Public CV:** a public version without private fields. `CV.pdf` includes a phone number, and the Lead must also decide on GPA and coursework.
- **Portrait:** none is available.
- **Production:** the project list, statuses, links and media. The CV names "Chess AI Tournament" and "AI Asset Studio", while the brief lists Chess AI / RL Server, Private Cloud, IT Studio, ExamBuilder, Facial Expression Recognition and Rosa Local AI Assistant. How these names map to each other is unconfirmed.
- **Character:** all character data.
- **Wanderlight:** gameplay mechanics and rendering approach.
- **Ethereal:** scene theme and audio assets with their licenses.
- **Typography:** font choice and its license.
- **Custom domain**, and whether to add any analytics. The default is no analytics.
- **Hosting account:** the Cloudflare account is still needed for M5. The Lead supplied `https://github.com/august0362/My_portfolio` as the Git remote. It was empty before the first push.

## 6. Verified implementation state (2026-11-15)

- Git was initialized on `main` at the Lead's request. The remote is `origin` (see §5). `.gitignore` excludes `data/` per P-08. The first commit holds docs only.
- There is no application code, `package.json`, config or dependencies.
- Existing files:
  - `data/Information/mobius_identity_public.json`
  - `data/CV/CV.pdf`, `data/CV/CV_png.png`
  - `data/Image/Tiên hiệp/` (8 JPG, about 1.4–1.8 MB each)
  - `data/Image/Cosplay Festival/` (4 JPG, about 6–11 MB each)
  - `data/Image/Birthday/` (5 JPG, about 0.1 MB each)
- The image files were not checked for EXIF metadata. Assume it is present and strip it on export.
- Documentation in `README.md`, `CLAUDE.md` and `docs/` was created in M0 and updated after the Lead's decision review.
