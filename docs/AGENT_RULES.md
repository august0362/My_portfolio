# Agent Rules

The human Engineering Lead makes all final decisions. Agents talk to the Lead in Vietnamese and write code and docs in English.

## 1. Roles and ownership

| Role | Owns (may edit) |
|---|---|
| Core | `src/main.tsx`, `src/core/**`, `src/shared/**`, `index.html`, `public/**`, `scripts/**`, `package.json`, lockfile, all root configs |
| Information | `src/worlds/information/**` |
| Production | `src/worlds/production/**` |
| Character | `src/worlds/character/**` |
| Wanderlight | `src/worlds/wanderlight/**` |
| Ethereal | `src/worlds/ethereal/**` |
| Integration / QA | Merges to `main`; `docs/STATUS.md`; the "Current verified state" section of module docs; may fix integration-only issues after Lead approval |

- The ownership areas above do not overlap.
- Since GATE-1, each world folder belongs to its world agent.
- `data/` is read-only for every agent. Only the Lead adds or changes raw material there.

## 2. Documentation edit rights

- `README.md`, `CLAUDE.md`, `docs/CONTEXT.md`, `docs/ARCHITECTURE.md`, `docs/PLAN.md`, `docs/AGENT_RULES.md`: changed only with Lead approval (normally by Core/Integration).
- `docs/STATUS.md`: Integration only, after verification.
- `docs/modules/<id>.md`: the world agent may update **Module architecture** and **Missing assets/data**. Integration updates **Current verified state**. Other sections need Lead approval.

## 3. Mandatory rules

1. Every task names exactly one owning module, an explicit scope and acceptance criteria.
2. Edit only files inside your ownership scope and your task's scope.
3. Do not change another owner's files, shared architecture, dependencies or configs. Use a change request (§8) instead.
4. Do not delegate to other agents, expand scope silently, or redesign unrelated working code.
5. Never invent content: no personal facts, achievements, benchmarks, characters, deployments or licenses. Use `placeholder: true` entries.
6. Never publish private data: the date of birth, the phone number from the CV, or image metadata.
7. Verify the repository state before claiming completion. Report honestly as complete, partial or blocked.
8. Use one branch or worktree per task. Never commit directly to `main`.
9. A module is merged only after its acceptance criteria pass and Integration verifies them.

## 4. Reading protocol

Follow [CLAUDE.md](../CLAUDE.md#reading-protocol-in-order-stop-when-you-have-enough). Do not read other worlds' docs or code.

## 5. Workflow and branching

1. Receive the task assignment (§9) and confirm the scope.
2. Create a branch from the latest `main`, named `<module>/<TASK-ID>-<slug>` (for example `information/INFO-01-identity`). For parallel work, use a worktree: `git worktree add ../mobius-wt/<TASK-ID> -b <branch>`.
3. Implement within scope. Commit in small steps with messages prefixed `[<TASK-ID>]`.
4. Verify (§6).
5. Hand off (§7). Integration reviews, merges into `main` and updates STATUS.

## 6. Verification

Required before handoff, using the real output:

```text
npm run typecheck
npm run lint
npm run test
npm run build
```

Also:
- Manually check your routes in `npm run preview`: keyboard navigation, mobile width (about 375 px) and reduced motion.
- No console errors.
- `git status` shows changes only inside your scope.
- If a command cannot run, say so and explain why. Never report a check you did not run.

## 7. Handoff report

The report is short and in Vietnamese:

```text
Task: <TASK-ID> · Module: <id>
Kết quả: complete | partial | blocked
File thay đổi: <paths>
Kiểm tra: <command → result>, <manual checks>
Vấn đề còn lại: <list or "không có">
Đề xuất tiếp theo: <one action>
Change requests: <if any, see §8>
```

## 8. Escalation and change requests

Stop and escalate to the Lead when:
- A shared change is needed (contract, registry, settings, tokens, dependency or config).
- Content or an asset is missing, or its license is unclear.
- Acceptance criteria conflict with each other or with the architecture.
- Privacy is uncertain.

Include a change request in the handoff, then continue only with the unblocked parts:

```text
CR: <short title>
Owner affected: Core | <world>
Why: <one or two lines>
Proposed change: <files/API, minimal>
Impact on other modules: <none | list>
```

## 9. Task assignment template

```text
Task ID: <ID from PLAN.md>
Owner/module: <role> / <id>
Branch: <module>/<TASK-ID>-<slug>
Goal: <one sentence>
Allowed paths: <globs>
Inputs: <docs sections, data files, assets>
Out of scope: <explicit list>
Acceptance criteria: <checklist>
Verification: §6 + <task-specific checks>
```
