# Phase 1 — Delivery Notes

This document records every place Phase 1 had to make a judgment call
because the docs were silent, ambiguous, or in conflict with the reference
screenshots — so nothing was invented silently.

## 1. Color values: screenshots win over MASTER_PROMPT.md

`MASTER_PROMPT.md` specifies `#121212` / `#1C1C1C` as the primary/secondary
background. `DESIGN_SYSTEM.md`, `UI_IMPLEMENTATION_GUIDE.md`, and the
reference screenshots all agree on `#111315` / `#1A1D20` / `#181A1C`
instead. Implemented the latter, per the project's own rule that reference
images are the highest design authority.

## 2. Detective Profile placement

`DESIGN_SYSTEM.md` places the Detective Profile block inside the sidebar.
Every reference screenshot instead shows it in the top-right header, with
only Rank/Cases Solved/Certificates in the sidebar footer. Built to match
the screenshots (`DashboardHeader.tsx` for the header badge).

## 3. Evidence unlock mechanic

Confirmed with the project owner: the "Unlocks at 75/80/85/90%" labels on
locked evidence cards in the reference screenshot were placeholder visuals,
not a real percentage-based mechanic. **No progress-percentage unlock logic
was built.** The real mechanic (event-driven unlocking, e.g. "unlocks after
reading a specific report") is a Phase 2 concern once evidence data exists.

## 4. Settings: "Autosave" toggle vs. the architecture's "always auto-save" rule

`TECHNICAL_ARCHITECTURE.md` states saves happen after every interaction
with no manual save button. The Settings reference screenshot shows an
"Autosave Progress" toggle that's ON. Both are honored: every settings
field genuinely persists to IndexedDB immediately on change (no gating),
the toggle itself is stored as a real, functional setting for future
engine-level use, and the "Save Changes" button at the bottom of the page
is kept for visual parity with the screenshot but acts as a confirmation
pulse rather than a persistence gate, since persistence already happened.

## 5. Notebook / Certificates / Achievements are global, not per-case

The sidebar is identical whether or not a case is open, and the Certificates
screenshot shows certificates from three different cases (DX-001, DX-002,
DX-003) on one screen. Built these three sections as global views over all
of the player's local data, not scoped to a single currently-open case.
`packages/storage` exposes both `listNotesForCase(caseId)` (for in-case use
in Phase 2) and `listAllNotes()` (for this global view).

## 6. Studio has no persistence layer yet

`TECHNICAL_ARCHITECTURE.md`'s STORAGE section only defines stores for the
**Player** app. Studio's own storage needs (draft cases, autosave while
authoring) are undocumented, so Studio's Settings → Language is in-memory
only for Phase 1 and resets on reload. Flagging this explicitly rather than
inventing a Studio database schema.

## 7. `.casepack` parsing is an interface, not an implementation

Per explicit instruction, `packages/case-parser` defines only the function
signatures the rest of the app will call (`readManifest`,
`validateCasepack`, `installCasepack`); every function throws
`NotImplementedError` until `CASE_SCHEMA.md` is provided. The Archive
page's "Import Case" button is fully wired to this interface and surfaces
the `NotImplementedError` as an honest in-product message rather than
crashing or silently doing nothing.

## 8. Fonts

`DESIGN_SYSTEM.md` specifies Inter (EN) and IBM Plex Sans Arabic (AR). This
build environment has no network access to Google Fonts at build time, so
both currently fall back to the system-ui stack via CSS variables
(`--font-inter`, `--font-ibm-plex-arabic` in
`packages/ui/src/styles/globals.css`). Swapping in the real font files via
`next/font/local` once assets are available requires no other code changes.

## 9. A real bug this phase's own tests caught

The first version of the storage test-reset helper (`__resetDbInstanceForTests`)
only nulled out the JS singleton reference, not the underlying fake
IndexedDB database — so state leaked across tests despite looking isolated.
Fixed by having the helper actually call `db.delete()` before clearing the
reference. Left in the test suite as a cautionary example of why
"reset the object" and "reset the storage" aren't the same thing — the same
distinction will matter for the real Reset Progress feature.

## 10. E2E tests are written but unexecuted in this environment

`playwright.config.ts` and `e2e/*.spec.ts` exercise the real onboarding
flow, sidebar gating, and settings persistence against an actual Chromium
browser driving the actual `pnpm dev:player` server. They cannot run here:
`npx playwright install chromium` fails with a `403 Host not in allowlist:
cdn.playwright.dev` from this sandbox's network egress proxy — a network
policy, not a problem with the tests or config. The specs are confirmed
free of TypeScript errors (`pnpm typecheck` includes `tsconfig.e2e.json`).
Run `npx playwright install --with-deps chromium && pnpm test:e2e` on a
machine with normal network access to execute them for real.

## 11. Root-level `pnpm test` was silently broken, now fixed

The first pass of this phase defined a root `"test": "vitest run"` script.
Run from the repo root with no Vitest config of its own, it picked up
`packages/storage`'s test files via Vitest's default glob but *not*
`packages/storage/vitest.setup.ts` (which loads `fake-indexeddb/auto`) —
so 9 of 12 tests failed with "IndexedDB is not available," even though
the same tests passed when run correctly from inside the package. Fixed
by delegating to `pnpm -r test`, which runs each package's own Vitest
config (and its own setup files) in its own directory. Caught by actually
running `pnpm test` from the root rather than assuming a plausible-looking
script worked.

## 12. Added test coverage for `i18n` and `ui`, not just `storage`

The instruction that "every component should be ... tested" wasn't fully
honored in the first pass — only `packages/storage` had tests. Added:
`packages/i18n` (`resolvePath` behavior including its no-throw fallback,
plus a structural parity test asserting `en.json` and `ar.json` define
exactly the same keys — this would have caught any missing translation at
test time instead of silently falling back at runtime), and
`packages/ui` (`Button`, `Toggle`, `SidebarNavItem` — variant classes,
ARIA switch semantics, disabled-state click suppression, active-state
`aria-current`). 35 unit tests total now pass across the three packages.

## 13. Windows compatibility fix

Audited every `package.json` script in the monorepo for Unix-only syntax.
Found one real problem: the root `clean` script used `rm -rf`, which
doesn't exist on Windows outside Git Bash/WSL. Replaced with `rimraf`
(a cross-platform Node package, not a shell command) and explicit paths
instead of shell glob expansion, since glob syntax itself differs between
bash/cmd/PowerShell. Every other script (`next`, `tsc`, `vitest`,
`eslint`, `prettier`, `playwright`) is a direct CLI invocation with no
shell-specific syntax and needed no changes. Added `docs/WINDOWS_SETUP.md`
covering the two genuine one-time Windows/pnpm gotchas that aren't
specific to this project (PowerShell's script execution policy, and
Developer Mode for symlink creation), and a `.gitattributes` to keep line
endings consistent across contributors on different OSes. Verified by
running `pnpm clean` and confirming it actually removes both apps'
`.next` output, then rebuilding from that clean state.

This project cannot be tested on an actual Windows machine from this
sandboxed Linux environment — the fixes above are based on well-documented
pnpm/Windows/PowerShell behavior, not a live Windows test run. If you hit
anything not covered in `WINDOWS_SETUP.md`, it's worth flagging back.

## 14. Critical bug: Tailwind was never actually generating CSS

Reported by the project owner as "the CSS does not work in app." Root
cause: `packages/ui/src/styles/globals.css` (the shared stylesheet both
apps import first) never contained the `@tailwind base;`
`@tailwind components;` `@tailwind utilities;` directives. Without them
present *somewhere* in the CSS import graph, PostCSS's Tailwind plugin has
no injection point — content scanning still runs, but there's nowhere to
put its output, so it silently emits nothing. Every component's
`className="flex bg-gold rounded-card ..."` was resolving to zero actual
CSS the entire time. The compiled stylesheet was 1,517 bytes (pure
hand-written `:root` variables); after the fix it's 13,613 bytes and
contains real, correctly-valued rules (verified directly against the
built `.next/static/css/*.css` output and against what a browser actually
downloads over HTTP, not just inferred from source).

While in there, also removed a latent, related risk: the shared
`tailwind.preset.js` had its own hardcoded `content` array with paths
like `"../../packages/ui/src/**/*.{ts,tsx}"`. This happened to resolve
correctly only because both apps currently sit at the same folder depth
(`apps/player`, `apps/caseforge`) — it would have silently broken content
scanning for any future app added at a different depth. Content paths are
now owned solely by each app's own `tailwind.config.js`, where they
already correctly existed; the preset only carries genuinely shared
theme/plugin config.

This is the most significant bug found in this project so far, and it
shipped past two rounds of "everything verified" builds because `next
build` succeeding and `pnpm typecheck`/`pnpm test` passing say nothing
about whether the *content* of the generated CSS is correct — only that
the build pipeline didn't error. Visual/rendering correctness needs to be
checked by inspecting the actual output artifact, not just build exit
codes. Added the CSS-content checks above as the standing way to verify
this class of bug going forward, since this sandbox still has no way to
render and screenshot a real browser.

## 15. CASEFORGE Studio case-creation wizard (partial, by design)

Added a real, navigable 12-step wizard shell (`apps/caseforge/src/components/CaseWizard`)
reachable from Cases → Create New Case. Only step 1, General Information,
is a real interactive form — its nine fields (title ar/en, description,
cover, difficulty, estimated time, crime type, keywords, version) are
taken verbatim from the documented field list in
`10_ADMIN_AND_PLAYER_SYSTEM.md`, and its difficulty/crime-type option
lists are taken verbatim from `12_AI_CASE_GENERATION_MODES.md` and
`11_AI_CASE_GENERATION_ENGINE.md` — nothing invented. It's held in
React state only, not persisted or wired to `.casepack` export, since
Studio still has no documented storage layer (§6) and export depends on
the full case schema. Steps 2–12 are an honest "waiting on
CASE_SCHEMA.md" card, not fake forms.

**Documentation conflict found while building this:** `06_CASEFORGE_STUDIO.md`
lists a 12-step flow (General Information, Victim, Crime Scene, Evidence,
Suspects, Witnesses, Timeline, Documents, Questions, Solution, Preview,
Export). `10_ADMIN_AND_PLAYER_SYSTEM.md`'s Arabic version lists 11 steps
in a different order (no separate Crime Scene step; Suspects comes before
Evidence). Built against the 12-step English version since it's the more
granular of the two — flagging rather than silently picking.

Also added a reusable `Stepper` component to `packages/ui` (numbered
steps, active/complete states, optional click-navigation) since Player's
Questions screen will need the same pattern later.

## 16. Another real test-isolation bug, same family as §9

Adding `Stepper`'s tests surfaced a bug that was already latent in every
other `packages/ui` component test: `@testing-library/react` normally
auto-registers `afterEach(cleanup)` by detecting a global `afterEach`, but
this project runs Vitest with `globals: false` (explicit imports
everywhere), so that auto-detection never fired — every test's rendered
DOM was silently accumulating across a whole file instead of being
unmounted between tests. `Button`/`Toggle`/`SidebarNavItem`'s tests each
happened to use different fixture text per test, so stale, un-cleaned-up
DOM from earlier tests never collided with later queries — pure luck.
`Stepper`'s tests reuse the same three step labels across all four tests,
which finally caused a real collision (`getByRole` matching multiple
leftover "Victim" buttons). Fixed by explicitly registering
`afterEach(() => cleanup())` in `packages/ui/vitest.setup.ts` instead of
relying on the implicit auto-detection. All 19 `ui` tests (39 total
across the monorepo) pass now for the right reason, not by accident.
