/**
 * DOSSIER X — Case Package Parser
 *
 * Implements CASE_SCHEMA.md's documented file shapes: manifest reading,
 * full package validation, and install into IndexedDB.
 *
 * Deliberately NOT implemented here: anything that resolves
 * `Evidence.unlockTrigger`, computes a final score from `solution.json`,
 * or evaluates `achievements.json` conditions. The project owner has
 * flagged the cross-file relationship/trigger vocabulary as pending a
 * "CASE_SCHEMA v2 – Relationships & Investigation Logic" document — this
 * package stores those values faithfully but doesn't act on them yet.
 */

export type { CasepackSource } from "./zip";
export { readManifest } from "./manifest";
export { validateCasepack, SUPPORTED_PACKAGE_VERSIONS, type CasepackValidationResult } from "./validate";
export { installCasepack, type InstallResult } from "./install";
export { CasepackValidationError, CasepackReadError } from "./errors";
