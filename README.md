# DOSSIER X — Monorepo

> Every Detail Tells a Story.

Offline, document-driven detective investigation platform. Two apps
(**Player** and **CASEFORGE Studio**), no backend, no accounts — all
progress lives in the browser's IndexedDB.

## Status: Phase 2 — Case data layer + read-only Player screens

`CASE_SCHEMA.md` has arrived (see `docs/14_CASE_SCHEMA.md`) and defines
the `.casepack` format. Built on top of it: real parsing, validation,
IndexedDB storage, and read-only Player screens (Suspects, Witnesses,
Evidence Locker, Crime Scene, Timeline, Case File, Questions). **Not**
built: anything requiring the cross-file relationship/trigger logic the
project owner flagged as pending a "CASE_SCHEMA v2" document — evidence
unlock resolution, answer grading, achievement rules, certificate
generation. See `docs/PHASE_2_NOTES.md` for the full list of decisions.

## Requirements

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)

**On Windows?** See [`docs/WINDOWS_SETUP.md`](docs/WINDOWS_SETUP.md) first —
it covers two common one-time setup steps (PowerShell's script execution
policy, and enabling Developer Mode for pnpm's symlinks) that aren't
specific to this project but trip up most pnpm + Windows first runs.

## Getting started

```bash
pnpm install

# Player app — http://localhost:3000
pnpm dev:player

# CASEFORGE Studio — http://localhost:3001 (run in a second terminal)
pnpm dev:caseforge
```

Both commands work identically in Command Prompt, PowerShell, Git Bash,
and any Unix shell — nothing here shells out to Unix-only commands.

## Other useful commands

```bash
pnpm typecheck       # TypeScript, strict mode, across every package/app + e2e specs
pnpm -r lint         # ESLint across every package/app
pnpm test             # unit tests: ui (19), i18n (8), storage (12), case-parser (16) — 55 total
pnpm test:e2e         # Playwright E2E — see note below
pnpm build           # production build of everything
```

**E2E tests**: `playwright.config.ts` and `e2e/*.spec.ts` are written and
type-checked, but cannot execute in a sandboxed environment without open
network access to `cdn.playwright.dev` (Playwright's browser-binary CDN).
Run `npx playwright install --with-deps chromium` once on a machine with
normal network access, then `pnpm test:e2e`.

## Repository layout

```
dossier-x/
├── apps/
│   ├── player/       # Next.js — the consumer-facing investigation app
│   └── caseforge/    # Next.js — the internal case-authoring studio
├── packages/
│   ├── ui/            # Shared design system: tokens + components (Button, Card, Dialog, Sidebar, Toggle, Slider...)
│   ├── i18n/           # Arabic/English translation loader + RTL/LTR context
│   ├── storage/        # IndexedDB wrapper (Dexie) — player profile, settings, notebook, achievements, certificates
│   ├── types/           # Shared app-level TypeScript types (NOT the case content schema)
│   ├── case-parser/      # .casepack ZIP parsing, Zod validation, IndexedDB install — real, tested
│   ├── engine/            # Reserved for Phase 3 (scoring, unlock resolution — pending CASE_SCHEMA v2)
│   ├── achievements/       # Reserved for Phase 3 (achievement rule engine)
│   └── certificates/        # Reserved for Phase 3 (certificate generation)
├── docs/               # Project documentation (MASTER_PROMPT.md, PRD, architecture, etc.)
├── design/              # Reference screenshots — the highest authority for UI decisions
└── templates/            # Reserved for case-content templates (Phase 2+)
```

## Design authority

The reference screenshots in `/design` are the highest authority for visual
decisions, per project rule. Where a markdown doc and a screenshot disagree
(e.g. background color, Detective Profile placement), the screenshot wins.
See the Phase 1 delivery notes for the specific conflicts found and how
they were resolved.

## What's deliberately NOT here yet

- Evidence unlock resolution (`unlockTrigger` is stored, not acted on)
- Answer grading / scoring / Final Report content
- Achievement-unlock rule evaluation
- Certificate eligibility and generation
- CASEFORGE Studio's wizard steps beyond General Information
- Studio's "Export" step producing a real `.casepack`

All of the above depend on relationship/trigger rules the project owner
has flagged as pending a "CASE_SCHEMA v2 – Relationships & Investigation
Logic" document.
