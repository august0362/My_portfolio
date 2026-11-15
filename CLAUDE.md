# CLAUDE.md: Möbius Universe agent entry point

Möbius Universe is a static, read-only personal portfolio. Its public name is **Celestial Portal** ([P-12](docs/CONTEXT.md#4-architecture-decisions)). It has a hub at `/` and five independent world modules. The confirmed stack is React + TypeScript + Vite, with Three.js / React Three Fiber available for 3D worlds. Read only what your task needs.

## Communication

- Talk to the human, who is the Engineering Lead and final decision maker, in **Vietnamese**.
- Write docs, code and comments in concise English.
- Keep approved user-facing content in its original language. For example, the bio is in Vietnamese.

## Reading protocol (in order, stop when you have enough)

1. This file.
2. The relevant section of [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
3. [docs/AGENT_RULES.md](docs/AGENT_RULES.md), required before any implementation work.
4. **Only** your assigned module doc: `docs/modules/<id>.md`.
5. Only the source files your task touches.
6. [docs/STATUS.md](docs/STATUS.md), only when you need task status or dependencies.

Do not read every module doc, scan the whole repository, or open `data/` files your task does not use.

## Which doc for what

| Need | Read |
|---|---|
| Product facts, what is confirmed or proposed | [docs/CONTEXT.md](docs/CONTEXT.md) |
| Folder layout, import rules, module contract | [ARCHITECTURE §2–§6](docs/ARCHITECTURE.md#2-repository-layout) |
| Hub and transitions | [ARCHITECTURE §8](docs/ARCHITECTURE.md#8-möbius-hub) |
| Assets, images, privacy stripping | [ARCHITECTURE §10](docs/ARCHITECTURE.md#10-asset-organization) |
| Performance, accessibility, audio | [ARCHITECTURE §11](docs/ARCHITECTURE.md#11-performance-and-accessibility) |
| Task scope and acceptance criteria | [docs/PLAN.md](docs/PLAN.md) and your task assignment |
| Ownership, branching, handoff format | [docs/AGENT_RULES.md](docs/AGENT_RULES.md) |

## Hard boundaries

- One agent owns one task in one module. Your task assignment lists the paths you may change.
- World code lives in `src/worlds/<id>/`. It may import `src/shared/**` and npm packages, and **never** another world or `src/core/**`.
- Core-owned files need Core/Integration approval to change: `src/core/`, `src/shared/`, `src/main.tsx`, `index.html`, `public/`, `scripts/`, `package.json`, lockfile, all configs, and `docs/` (except where AGENT_RULES allows).
- Do not add a backend, database, auth, CMS, server-side inference, game engine or state-management library. If you need a new dependency, request it and do not install it yourself.
- **Privacy:** never publish the creator's date of birth (private) or the phone number found in `data/CV/`. Strip all metadata from published images. Never invent personal facts, achievements, benchmarks, characters or deployments.
- Use only original, licensed or permitted assets. Use clearly marked placeholders for missing content.
- Never claim completion without running the verification commands in AGENT_RULES.

## Workflow

Take the assigned task, work on its branch, implement within scope, verify, then write a short Vietnamese handoff ([format](docs/AGENT_RULES.md#7-handoff-report)).
If you need a change outside your scope, write a change request in the handoff and stop that part of the work. Do not edit another owner's files and do not delegate to other agents.
