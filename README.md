# Möbius Universe

The personal interactive universe of **August (Trần Anh Việt)**. A luminous Möbius ribbon floats in a celestial hub, and five world cards orbit along it. Each card opens an independent world.

| World | Route | Working title | Purpose |
|---|---|---|---|
| Information | `/information` | Chronicle | Identity, journey, photos, skills, resume |
| Production | `/production` | The Forge | Engineering, AI and cloud projects |
| Character | `/character` | Astral Codex | Original fantasy and celestial character designs |
| Wanderlight | `/wanderlight` | Wanderlight | A small, relaxing exploration game |
| Ethereal | `/ethereal` | Ethereal | An ambient audiovisual scene |

V1 is a **public, static, read-only** website. It has no backend, database, authentication or CMS, and content is updated through Git.

## Status

The repository has no application code yet. See [docs/STATUS.md](docs/STATUS.md) for the current state.

## Repository structure

Current contents, verified 2026-11-15:

```text
.gitignore   Excludes data/, node_modules/, dist/.
data/        Raw source material (CV, photos, identity JSON). Outside Git, backed up separately (P-08). Never shipped as-is.
docs/        Project documentation.
README.md    This file.
CLAUDE.md    Entry point for AI agents.
```

The planned layout (`src/core`, `src/shared`, `src/worlds/<id>`, `public/`) is described in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#2-repository-layout).

## Development

Nothing is available yet. Task `CORE-01` will create the commands. The planned commands are `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint` and `npm run test`.

## Documentation

- [CLAUDE.md](CLAUDE.md): AI agent entry point and reading protocol
- [docs/CONTEXT.md](docs/CONTEXT.md): product context and decision log
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): stack, boundaries, module contract, performance and deployment
- [docs/PLAN.md](docs/PLAN.md): milestones and tasks
- [docs/AGENT_RULES.md](docs/AGENT_RULES.md): ownership, workflow and handoff
- [docs/STATUS.md](docs/STATUS.md): verified status board
- [docs/modules/](docs/modules/): one document per world

## Deployment

The site deploys as static files. The host is Cloudflare Pages (P-06), which serves the `dist/` output of `npm run build`. See [ARCHITECTURE §12](docs/ARCHITECTURE.md#12-deployment).
