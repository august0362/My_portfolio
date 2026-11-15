# World: Production (The Forge)

ID `production` · Route `/production` · Owner: Production agent

## Purpose and scope

Shows engineering, AI, software, cloud and experimental projects as a data-driven catalog with a detail view for each project.

## Confirmed content

Confirmed: **Chess AI Tournament** (owner brief, repository `github.com/august0362/BTL_AI`, game website `admin-linux.tail451544.ts.net` confirmed by the owner). The other candidates (Private Cloud, IT Studio, ExamBuilder, Facial Expression Recognition, Rosa Local AI Assistant) are **not verified**; their status, links and demos must come from the Lead.

The CV (`data/CV/CV.pdf`) describes "Chess AI Tournament" and "AI Asset Studio" (the latter under development). How these names map to the candidate list is unconfirmed.

## V1 deliverables

| Task | Deliverable | Acceptance |
|---|---|---|
| PROD-01 | Catalog at `/production` (filter by status), detail view at `/production/:slug`, typed schema, placeholder entries | Adding a project requires only a new data entry. Status badges clearly separate completed, in-progress and experiment. Unknown slug shows a not-found state with a link back to the catalog |
| PROD-02 | Real project entries | Every fact, link and media item is supplied or confirmed by the Lead. Nothing is marked deployed unless verified. No invented benchmarks |

## Deferred

Embedded live demos that require a server, interactive architecture diagrams, search.

## Module architecture

Schema in `types.ts`:

```ts
{
  slug, title, status, summary,
  role?, stack[], period?,
  links?: { repo?, demo?, docs? },
  media?: [{ type, src, alt }],
  architectureImage?,
  placeholder?
}
```

- `data/projects.ts` holds the entries.
- `components/` holds the card, grid and detail components.
- `assets/<slug>/` holds images.
- Demos are external links only. Server-side AI inference never runs in this static site.

## Owned paths

`src/worlds/production/**`

## Shared dependencies

`@shared/contract`, `@shared/settings`, `@shared/tokens.css`, React Router.

## Missing assets/data

- The verified project list with statuses, descriptions, roles and dates.
- GitHub, demo and docs URLs.
- Screenshots and diagrams.

## Current verified state

PROD-01 is done with one real project (2026-11-15, REDESIGN-01): full-screen explorable scene, project detail with the GitHub link in the footer (the hero shows only Play Game), English and Vietnamese copy, five palettes × light/dark. Live server status asks `https://admin-linux.tail451544.ts.net/health`; it shows "Status unavailable" until the game proxy answers that route with `{ "service": "chess-ai", "status": "online" | "offline" }` and `Access-Control-Allow-Origin`. Details and verification: `src/worlds/production/README.md` and [STATUS.md](../STATUS.md).
