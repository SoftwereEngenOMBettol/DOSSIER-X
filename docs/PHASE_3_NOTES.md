# Phase 3 — Delivery Notes: Storefront Catalog

## 1. The core architectural problem this solves

The Archive could previously only show cases that had actually been
imported — there was no way to say "here are 7 cases, 2 exist, buy the
rest." Solved by introducing a **catalog**: a static listing (title,
cover, difficulty, stat counts, purchase link) that exists independently
of whether a case has ever been installed. The Archive now merges this
catalog with `listInstalledCases()` at render time — owned cases show
real data from their installed bundle, everything else shows the catalog
preview behind a lock.

## 2. Conflict with the planning doc's example numbers

The provided spec's worked example for "DX002" (Hard, 150 min, 48
evidence, 29 documents, 6 witnesses) doesn't match the actual DX002 that
was built and approved (Beginner, 60 min, 22 evidence, 5 documents, 3
witnesses). Treated the spec's numbers as illustrative of the *UI
pattern*, not a content requirement — kept the real, already-validated
DX002 content as authoritative rather than silently overwriting it.

## 3. DX003–DX007 show honest "Coming Soon" cards, not fabricated stats

Only DX001 and DX002 exist. Rather than inventing plausible-looking
evidence/document/witness counts for the other five, their catalog
entries have `releaseReady: false` and an empty `stats` object — the
Archive renders these as a distinct "Coming Soon" card (clock icon, no
purchase link, not clickable-to-buy) rather than a purchasable "Locked"
card with numbers that would need to be corrected later. The moment each
case is actually built, updating its catalog entry (`releaseReady: true`
+ real stats) is the only change needed — no code changes.

Same reasoning for achievement titles: `achievementTitles` is only
populated for DX001/DX002, where the titles are real. For DX003–007 it's
`undefined`, and the Achievements page shows a generic locked message
instead of invented names.

## 4. DX001 bundled with the app, auto-installed on first launch

Per the requirement that one case be free and immediately playable. The
actual `DX001.casepack` file lives in `apps/player/public/starter-case/`
and is fetched + run through the *exact same* `installCasepack()`
pipeline a purchased case uses — `useEnsureStarterCaseInstalled` just
triggers it automatically on first dashboard load instead of waiting for
a file-picker selection. No separate "free case" code path to drift out
of sync with the real one. Verified by fetching the bundled file over
HTTP (as the browser would) and validating it against the real parser —
still passes cleanly.

## 5. Purchase links: one file, fetched at runtime, not bundled at build time

Per the explicit requirement that Gumroad links be editable without
touching code. `store-config.json` lives in `public/` and is fetched via
`fetch()` at runtime, not imported as a TypeScript module — a build-time
import would still require a rebuild to pick up a changed URL, which
defeats the purpose. Every URL currently in the file is a clearly-marked
placeholder (`YOUR-STORE.gumroad.com`) — not treated as functional, since
"herewe.gumroad.com" in the original spec reads as illustrative text
("here we'd put the link") rather than a real store handle.

## 6. Runtime catalog validation, not just a type cast

First pass fetched `case-catalog.json` and cast it directly to
`CaseCatalogEntry[]` with no runtime check — meaning a future hand-edit
of the file that omitted an optional field wouldn't get Zod's `.default()`
applied, since defaults only apply during an actual `.parse()`/`.safeParse()`
call, not a TypeScript type assertion. Fixed to run the fetched data
through `CaseCatalogSchema.safeParse()` for real, with a clear error
surfaced if someone breaks the file's shape.

## 7. Certificates/Achievements now have three real states, not two

Previously: certificate exists (earned) or nothing shows. Now, per case:
**earned** (real `CertificateRecord`/unlocked achievement exists — shown
in full), **owned-not-completed** ("Complete this investigation to
unlock..."), and **not-purchased** ("Purchase this investigation to
unlock..."). The distinction between the second and third message is the
whole point of the feature — a player should see a different prompt for
"you own this, go finish it" versus "you don't own this yet."

## 8. Verification

`pnpm typecheck` clean across all packages/apps. `pnpm -r lint` zero
warnings. `pnpm test` 39/39 passing. `pnpm build` clean from a `pnpm
clean` state. Confirmed live: all 5 new static assets
(`case-catalog.json`, `store-config.json`, 2 sample covers, the bundled
`.casepack`) return HTTP 200 and serve the correct content; the bundled
starter case re-validates successfully after being fetched over HTTP,
proving the auto-install path works end-to-end, not just in theory.
