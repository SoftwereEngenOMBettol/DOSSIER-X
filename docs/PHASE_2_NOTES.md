# Phase 2 — Delivery Notes

Everything here became buildable once `CASE_SCHEMA.md` arrived (see
`docs/14_CASE_SCHEMA.md`). Same rule as Phase 1: every judgment call gets
recorded here rather than made silently.

## 1. The line: data + display are built, engine logic is not

CASE_SCHEMA.md's own closing note flags the cross-file relationship and
trigger vocabulary (`unlockTrigger`, question-evidence dependencies,
scoring) as pending a "CASE_SCHEMA v2 – Relationships & Investigation
Logic" document, and explicitly asks that the engine not be completed
until that arrives. Built accordingly:

**Built:** Zod schemas + TypeScript types for every file with a concrete
JSON example, a real ZIP-based parser, full package validation, IndexedDB
storage for case content and binary assets, and read-only Player screens
(Suspects, Witnesses, Evidence Locker, Crime Scene, Timeline, Case File)
that display this data with no business logic in the components
themselves.

**Not built:** anything that resolves `Evidence.unlockTrigger` (all
evidence is shown as available — no hiding, no percentage-based or
event-based gating, since the trigger vocabulary isn't defined), anything
that compares a player's answer against `solution.json` or computes
correctness/score, achievement-unlock rule evaluation, certificate
eligibility/generation, and CASEFORGE Studio's wizard steps beyond
General Information (their field-level shapes now exist in the schema,
but authoring UI for them is a separate scope decision — see §8).

Questions is a middle case: the screen lets the player select and record
an answer per question (auto-saved, like a Notebook entry) but does not
grade it. Selecting an answer is data capture; grading it is the engine
logic being held back.

## 2. manifest.json's shape conflicts with the earlier inline example

`TECHNICAL_ARCHITECTURE.md` (Phase 1) showed a manifest example with a
localized `{ar, en}` title object and an `"engine"` version field.
`CASE_SCHEMA.md` — the later, dedicated, deliberate specification — uses a
**plain string** title and a `"packageVersion"` field instead. Implemented
exactly as CASE_SCHEMA.md specifies. This also means `manifest.title` and
`case.title` are genuinely different shapes (string vs. localized object)
by design, not an oversight — the manifest is for quick engine-level
identification, the full localized content lives in case.json.

## 3. CASE_PACKAGE_SPEC.md's file list is superseded

The earlier `05_CASE_PACKAGE_SPEC.md` listed a different internal
structure (a `translations/` folder, flat `images/`/`audio/` folders, no
`crime_scene.json`/`documents.json`/`certificate.json`/`achievements.json`/
`assets.json`). CASE_SCHEMA.md is the newer, dedicated, far more detailed
spec — treated as authoritative for package *contents*.
CASE_PACKAGE_SPEC.md's higher-level concepts (install flow, versioning
fields, license concept) still stand and don't conflict.

## 4. Three files have no concrete shape — stored, not validated

`localization.json`, `assets.json`, and `license.json` are each described
only in prose in CASE_SCHEMA.md, with no example the way every other file
gets one. Built a permissive `UnspecifiedJsonObjectSchema` (any valid JSON
object) for all three rather than inventing field-level shapes. They
round-trip through install correctly; nothing reads specific fields from
them yet.

## 5. Question types beyond multiple_choice have no given shape

Only `multiple_choice` comes with a concrete example (`options[]` +
`answer`). Other types named elsewhere in the docs (single_choice,
evidence_selection, timeline_order, text) have no JSON shape given.
`QuestionSchema` keeps `options`/`answer` optional and `type` a free
string rather than a closed enum, so the schema doesn't reject question
types it can't yet render. The Questions *screen* only renders the
options-based UI; other types would currently show no interactive
control (acceptable for now — no case content exercises them yet).

## 6. Zod chosen for runtime validation, not just compile-time types

`packages/types` now uses Zod schemas as the single source of truth,
inferring TypeScript types from them (`z.infer<...>`) rather than
maintaining hand-written interfaces separately. This directly serves
CASE_PACKAGE_SPEC.md's validation requirements ("Reject package if:
Missing files, Invalid manifest, Corrupted JSON, Unsupported version,
Broken assets, Invalid license") — `case-parser` uses the same schemas at
runtime to validate an actual uploaded file, not just to type-check
authored code.

## 7. Assets stored as ArrayBuffer + MIME type, not as Blob

Original design stored binary assets as native `Blob` objects in
IndexedDB. Testing surfaced that `fake-indexeddb` doesn't reliably
preserve `Blob` instances through its structured-clone implementation —
a `Blob` read back after a `put()` came back as `{}`. Rather than treat
this as purely a test-environment quirk and paper over it, switched to
storing raw `ArrayBuffer` + an explicit `mimeType` string and
reconstructing a `Blob` only at the point of use (`resolveCaseAssetUrl`).
This is arguably better production code regardless of the test
environment — IndexedDB's native Blob support has had real inconsistencies
across browsers historically (Safari in particular), and ArrayBuffer
sidesteps the question entirely.

## 8. CASEFORGE Studio's wizard: still only General Information

CASE_SCHEMA.md now gives concrete field-level shapes for every wizard
step's content (Victim, Suspects, Witnesses, Evidence, Crime Scene,
Timeline, Documents, Questions, Solution), which removes the *data-shape*
blocker for building real authoring forms for all of them. Not done in
this phase, purely a scope/time boundary, not a rule-based blocker like
Phase 1's — building ten more CRUD forms is mechanical repetition of the
General Information step's pattern and is the natural next increment,
along with wiring Studio's "Export" step to actually produce a real
`.casepack` using `case-parser`'s (currently import-only) machinery in
reverse.

## 9. Player routing restructured to /investigation/[caseId]/...

Phase 1's case-required screens lived at flat top-level paths
(`/suspects`, `/timeline`, etc.) with no way to represent "which case."
Now that cases are real and a player could plausibly own several,
restructured those eight screens under a dynamic `[caseId]` route segment,
matching how the reference screenshots always show a case id in the page
header ("DX-001 – Room 308"). `useParams()` in the sidebar reads the
current caseId directly from the URL rather than a separate global
"current case" state — one source of truth, no synchronization to get
wrong.

## 10. Test fixture: a deliberately generic sample .casepack

`packages/case-parser`'s tests build a minimal, generic sample case
in-memory via JSZip (id `DXTEST`, one suspect, one witness, one piece of
evidence, etc.) to exercise the full validate/install pipeline. This is
standard parser-testing practice, not "inventing product content" in the
sense the project rules warn against — it's deliberately generic rather
than a polished case, exists only under `__tests__/fixtures/`, and is
never shipped or shown to a real player.

## 11. A real cross-environment test bug: JSZip needs FileReader

`case-parser`'s tests originally ran in a plain Node Vitest environment
and failed with "Can't read the data of the loaded zip file" — JSZip's
Blob-reading path depends on `FileReader`, which exists in browsers and in
jsdom, but not in bare Node. Switched the package's test environment to
`jsdom`, which also more faithfully exercises the actual browser code path
this parser runs in production (`File`/`Blob` input from a file picker).

## 12. Same tsconfig `rootDir` fix applied everywhere, proactively

Phase 1 found that `rootDir: "src"` in a package's tsconfig silently
excludes a `vitest.setup.ts` living outside `src/` from the typecheck
program. Rather than wait to hit this again per-package, removed
`rootDir`/`outDir` from every package's tsconfig in one pass (`ui`,
`i18n`, `storage`, `types`, `case-parser`, `achievements`, `certificates`,
`engine`) — none of them have a real `dist/` consumer yet, so nothing
depended on those settings.

## 13. Verification, this phase

`pnpm typecheck` clean across all 10 packages/apps + e2e specs.
`pnpm -r lint` zero warnings. `pnpm test`: 55/55 passing (19 ui + 8 i18n +
12 storage + 16 case-parser). `pnpm build` from a `pnpm clean` state: both
apps compile with zero errors; the 8 case-scoped Player routes correctly
build as dynamic (`ƒ`) routes. Confirmed live: all routes return HTTP 200
including `/investigation/DX001/suspects`, and the compiled CSS still
contains real Tailwind output (15.4 KB, `.bg-gold` present) after all of
this phase's changes.
