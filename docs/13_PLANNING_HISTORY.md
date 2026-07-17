# Planning History

This file consolidates three planning/meta discussions from the project
owner. Unlike the numbered documents (01–12), these were never presented
as final specifications — they're the reasoning trail that shaped the
project's documentation plan. Kept here, separately, so they aren't
mistaken for authoritative spec content.

---

## 1. PRD chapter plan (PRODUCT_REQUIREMENTS.md was proposed, never written)

The project owner proposed writing a `PRODUCT_REQUIREMENTS.md` (PRD) as a
15-chapter document (Product Vision, Player Journey, UI Structure,
Investigation Engine, Case Package System, Save System, Certificate
Engine, Achievement System, Marketplace, Localization, Design System,
Accessibility, Performance, Future Roadmap, Acceptance Criteria), to be
delivered as a real `/docs` folder in a Git repository rather than pasted
inline in chat. **This PRD was never actually written** — its content was
instead delivered piecemeal as the other numbered documents in this
folder (03–12). There is no single canonical PRD file; this repository's
`/docs` folder as a whole serves that role.

## 2. Recommended additional documents (mostly still outstanding)

The project owner identified six additional documents as necessary before
implementation, rated by importance:

1. **PROJECT_RULES.md** ⭐⭐⭐⭐⭐ — a "do not" list (no backend, no Firebase,
   no business logic in components, no TODOs/placeholders in final builds,
   etc.). *Not yet written as a standalone file* — its content has been
   absorbed into MASTER_PROMPT.md, TECHNICAL_ARCHITECTURE.md, and this
   Phase 1 codebase's actual constraints, but no single PROJECT_RULES.md
   exists.
2. **FOLDER_STRUCTURE.md** ⭐⭐⭐⭐⭐ — superseded by the repository plan in
   ADMIN_AND_PLAYER_SYSTEM.md (10_ADMIN_AND_PLAYER_SYSTEM.md) and now by
   the actual folder structure of this repository.
3. **COMPONENT_LIBRARY.md** ⭐⭐⭐⭐⭐ — **still outstanding.** Phase 1 built
   a first set of shared components (Button, Card, Dialog, Sidebar,
   Toggle, Slider, LanguageSwitch) but there is no formal document listing
   every planned component, its props, and its states.
4. **CASE_SCHEMA.md** ⭐⭐⭐⭐⭐ — **the critical blocker for Phase 2.** The
   project owner has confirmed this will be provided directly as JSON
   text. Nothing case-shaped should be built until it arrives.
5. **USER_FLOW.md** ⭐⭐⭐⭐☆ — mostly covered by the Player Journey section
   of MASTER_PROMPT.md and the screen-by-screen flow in
   ADMIN_AND_PLAYER_SYSTEM.md.
6. **DESIGN_REFERENCE kit** ⭐⭐⭐⭐⭐ — delivered; see `/design`.

Also proposed and still outstanding: **CASE_CREATION_GUIDELINES.md**
(content-quality rules per difficulty tier: suspect counts, evidence
counts, red-herring ratios, writing style for reports) and
**BUSINESS_MODEL.md** (pricing tiers, bundles, DLC, licensing approach).

## 3. Documentation status review

A later review reconfirmed the state of the documentation set and singled
out three items as the true remaining blockers before implementation could
begin with confidence: the Design Reference Kit (done, see `/design`),
the Case Schema (outstanding — blocks Phase 2), and the Component Library
(outstanding — a living document, best grown alongside `packages/ui`
rather than written speculatively upfront).

This review also raised the packaging/anti-piracy question — whether
`.casepack` files should carry a license key or digital signature to deter
casual redistribution. `CASE_PACKAGE_SPEC.md` already reserves fields for
this (`license.json`: License ID, Case ID, Issue Date, Checksum, Digital
Signature, License Type), but the actual signing/verification scheme is
still undesigned and depends on CASE_SCHEMA.md.
