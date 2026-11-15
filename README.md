# Möbius Universe

The personal interactive universe of **August (Trần Anh Việt)**. Its hub, the Celestial Portal, shows five world cards orbiting a celestial canvas. Each card opens an independent world.

| World | Route | Working title | Purpose |
|---|---|---|---|
| Information | `/information` | Chronicle | Identity, journey, photos, skills, resume |
| Production | `/production` | The Forge | Engineering, AI and cloud projects |
| Character | `/character` | Astral Codex | Original fantasy and celestial character designs |
| Wanderlight | `/wanderlight` | Wanderlight | A small, relaxing exploration game |
| Ethereal | `/ethereal` | Ethereal | An ambient audiovisual scene |

V1 is a **public, static, read-only** website: React + TypeScript + Vite, no backend, database, authentication or CMS. Content is updated through Git. Current state: [docs/STATUS.md](docs/STATUS.md).

## Development

Requires Node.js 22.13+ and npm. On Windows, `run.bat` installs dependencies if needed and starts the dev server.

```text
npm ci                 install pinned dependencies
npm run dev            dev server
npm run build          typecheck + production build to dist/
npm run preview        serve dist/
npm run typecheck | lint | test
npm run images -- --world <id> <files>   raw photos -> metadata-free WebP
```

## Layout

```text
src/core/      shell, router, registry, hub (Core-owned)
src/shared/    contract, settings, tokens: the only code worlds may import
src/worlds/    one folder per world, owned by its world agent
scripts/       image optimizer
docs/          documentation
data/          raw source material, outside Git (P-08), never shipped as-is
```

## Documentation

- [CLAUDE.md](CLAUDE.md): AI agent entry point and reading protocol
- [docs/CONTEXT.md](docs/CONTEXT.md): product context and decision log
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): stack, boundaries, module contract, performance and deployment
- [docs/PLAN.md](docs/PLAN.md): milestones and tasks
- [docs/AGENT_RULES.md](docs/AGENT_RULES.md): ownership, workflow and handoff
- [docs/STATUS.md](docs/STATUS.md): verified status board
- [docs/modules/](docs/modules/): one document per world

## Deployment

Static files on Cloudflare Pages (P-06), built with `npm run build` into `dist/`. See [ARCHITECTURE §12](docs/ARCHITECTURE.md#12-deployment).
