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
- The homepage is the hub (the Celestial Portal, [P-14](#4-architecture-decisions)): five world cards orbiting a 2D celestial canvas, click to enter, smooth scene transitions and a reliable return to the hub. The hub must work with keyboard and touch, with reduced motion, and on weak devices. The original 3D Möbius ribbon and the pixel reconstruction effect were dropped (P-14).
- Five worlds with fixed IDs and routes: `information`, `production`, `character`, `wanderlight`, `ethereal`, each served at `/<id>`.
- The shared style is Ethereal Celestial Fantasy. Each world may have its own visual identity under the shared navigation.
- AI agent ownership model: see [AGENT_RULES.md](AGENT_RULES.md).

## 3. Identity content (CONFIRMED)

- The approved public identity data lives in [data/Information/mobius_identity_public.json](../data/Information/mobius_identity_public.json). That file is the single source for name, display name, role, education, headline, Vietnamese bio, fields, interests, goal, personality, visual styles and public contacts (GitHub, Facebook, email).
- LinkedIn and the personal motto are not provided (`null`), and the portrait is not provided (`null`).
- **Private:** the date of birth must never appear in site content, data, metadata or docs. The CV also contains a phone number, which is treated as private until the Lead approves publishing it.

## 4. Architecture decisions

Lead review on 2026-11-15: P-01–P-16 are CONFIRMED (P-09 was DEFERRED until the Information integration).

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
| P-09 | CONFIRMED | Photo album mapping: `Tiên hiệp` → Studio Photography, `Cosplay Festival` → Cosplay Collection, `Birthday` → Life Moments (Lead, 2026-11-15) | Matches the existing folders to the brief's album categories |
| P-10 | CONFIRMED | Hub cards are HTML links positioned over a decorative canvas (a 2D canvas since P-14) | Readable, accessible, focusable, and keeps a no-canvas fallback |
| P-11 | CONFIRMED | npm as the package manager | Default, no extra tooling |
| P-12 | CONFIRMED | The public name is **Celestial Portal**, used in the page title and the launcher. "Möbius Universe" stays the internal project name (repository, package, docs) | Lead decision, 2026-11-15 (HUB-REV) |
| P-13 | CONFIRMED | Hub settings follow HUB-REV: visitors choose only appearance (dark or light) and palette. Sound is on by default with no off switch. Motion follows the system setting. Quality starts at full ([ARCHITECTURE §7](ARCHITECTURE.md#7-shell-behavior-core), [§11](ARCHITECTURE.md#11-performance-and-accessibility)) | Lead decision, 2026-11-15. Replaces the earlier rule that sound stays off and motion can be toggled in the app |
| P-14 | CONFIRMED | The hub stays the HUB-REV 2D Celestial Portal. HUB-02 (lazy WebGL HubScene with the Möbius ribbon) is dropped. The pixel reconstruction effect is dropped. HUB-03 is met by the existing water-style scene transitions | Lead decision, 2026-11-15. `three`/R3F (P-03) stay available for worlds only |
| P-15 | CONFIRMED | The Information world ships the Chronicle prototype as built: hub title "Chronicle", the public identity JSON including the email contact, the supplied journey, the three P-09 albums, and the public CV as an HTML sheet without the phone number (no CV file). Fonts: Cormorant Garamond and Be Vietnam Pro (SIL OFL) from Google Fonts in `index.html`. World routes are full-bleed, with a floating Back to Hub link | Lead decision, 2026-11-15 (integrate the prototype as is) |
| P-16 | CONFIRMED | Paired themes: the Atmosphere panel (`settings.appearance` and `settings.palette`) is the only color control on the site. Every world follows it: light/dark follows `appearance`, and each palette (Moonlit, Rosewater, Tidal) maps to one paired world theme in a matching color story. Worlds do not add their own palette or light/dark controls | Lead decision, 2026-11-15: pages must stay color-compatible with each other |

## 5. Not yet decided

- **Site language:** Vietnamese, English or bilingual UI. The bio is Vietnamese, the headline is English, and the JSON lists interests in Vietnamese while the brief lists them in English.
- **Portrait and milestone images:** none are available yet. Journey, skills and the public CV were settled with P-15.
- **Production:** the project list, statuses, links and media. The CV names "Chess AI Tournament" and "AI Asset Studio", while the brief lists Chess AI / RL Server, Private Cloud, IT Studio, ExamBuilder, Facial Expression Recognition and Rosa Local AI Assistant. How these names map to each other is unconfirmed.
- **Character:** all character data.
- **Wanderlight:** gameplay mechanics and rendering approach.
- **Ethereal:** scene theme and audio assets with their licenses.
- **Typography** outside the Information world (P-15 covers that world's fonts).
- **Custom domain**, and whether to add any analytics. The default is no analytics.
- **Hosting account:** the Cloudflare account is still needed for M5. The Lead supplied `https://github.com/august0362/My_portfolio` as the Git remote. It was empty before the first push.

## 6. Raw material in `data/` (outside Git, P-08)

- `Information/mobius_identity_public.json`: approved public identity.
- `CV/CV.pdf`, `CV/CV_png.png`: private source; the public CV is the HTML sheet in the Information world (P-15).
- `Image/Tiên hiệp/` (8 JPG), `Image/Cosplay Festival/` (4 JPG), `Image/Birthday/` (5 JPG): raw photos with metadata. Publish only through `npm run images`.

Implementation state lives in [STATUS.md](STATUS.md).
