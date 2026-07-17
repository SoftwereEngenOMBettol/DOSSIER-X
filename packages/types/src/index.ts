/**
 * DOSSIER X — Shared App-Level Types
 *
 * IMPORTANT: This file intentionally does NOT define the investigation/case
 * data schema (manifest.json, case.json, suspects.json, etc.). That schema
 * will be provided by the project owner as CASE_SCHEMA.md and must not be
 * invented here. Everything below is app-owned state: the player's local
 * profile, settings, and progress bookkeeping — independent of any specific
 * case's content.
 */

export type Locale = "ar" | "en";
export type Theme = "dark"; // Only Dark is specified for v1.0; Light/Sepia are shown
// as future options in the Settings screenshot but are NOT implemented yet.

/** A locally-generated identifier, not a case ID and not a user account ID. */
export type LocalId = string;

export interface PlayerProfile {
  id: LocalId;
  name: string;
  locale: Locale;
  rank: string; // e.g. "Junior Detective" — rank *labels* are engine-defined later (Phase 2+)
  xp: number;
  casesSolved: number;
  createdAt: string; // ISO date
}

export interface AppSettings {
  locale: Locale;
  theme: Theme;
  soundEnabled: boolean;
  musicEnabled: boolean;
  masterVolume: number; // 0-100
  musicVolume: number; // 0-100
  sfxVolume: number; // 0-100
  autosaveEnabled: boolean; // always true in v1.0; exposed for future toggling
  confirmBeforeExit: boolean;
  showCompletedTags: boolean;
}

/**
 * A note the player wrote. Notebook entries are player-owned data and are
 * never part of a case package — they reference a case by ID only.
 */
export interface NotebookEntry {
  id: LocalId;
  caseId: string; // references an installed case's manifest.id (opaque string, schema TBD)
  createdAt: string;
  updatedAt: string;
  text: string;
  pinned: boolean;
}

/**
 * Achievement *unlock records* — the catalog of achievement definitions
 * (rules, XP rewards, icons) belongs to the engine layer, built once
 * CASE_SCHEMA.md / DETECTIVE_ENGINE rules are finalized. This is only the
 * player's local record of which achievement IDs are unlocked and when.
 */
export interface AchievementRecord {
  achievementId: string;
  unlockedAt: string | null; // null = locked
  progressCurrent: number;
  progressTarget: number;
}

/** A generated certificate record, keyed by case. */
export interface CertificateRecord {
  id: LocalId;
  caseId: string;
  caseTitle: string;
  playerName: string;
  rank: string;
  score: number;
  /** Total active investigation time, in seconds. */
  timeTakenSeconds: number;
  difficulty: string;
  issuedAt: string;
  certificateNumber: string;
}

/**
 * Minimal per-case install bookkeeping that the Foundation layer needs to
 * track *that* a case is installed and its high-level state, without
 * knowing anything about the case's internal content structure.
 */
export type CaseInstallStatus = "locked" | "owned" | "in_progress" | "completed";

export interface InstalledCaseRecord {
  caseId: string;
  installedVersion: string;
  installedAt: string;
  lastOpenedAt: string | null;
  /** Set once, the first time the player opens the investigation (owned -> in_progress). Distinct from lastOpenedAt, which updates on every visit — this is the stable start point for computing time taken. */
  startedAt: string | null;
  status: CaseInstallStatus;
}

export * from "./case";
export * from "./catalog";

/**
 * Records which option the player selected for a question — pure data
 * capture, like a Notebook entry. Deliberately does NOT record whether the
 * answer was correct: comparing against solution.json is scoring/grading
 * logic, which depends on the not-yet-specified relationships/engine
 * rules (see CASE_SCHEMA.md's closing note on a pending v2 spec).
 */
export interface QuestionAnswerRecord {
  caseId: string;
  questionId: string;
  selectedOption: string;
  answeredAt: string;
}
