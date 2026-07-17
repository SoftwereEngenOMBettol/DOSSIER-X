import Dexie, { type EntityTable, type Table } from "dexie";
import type {
  PlayerProfile,
  AppSettings,
  NotebookEntry,
  AchievementRecord,
  CertificateRecord,
  InstalledCaseRecord,
  CaseBundle,
  QuestionAnswerRecord,
} from "@dossier-x/types";

/** One binary asset (image, PDF, audio) belonging to an installed case. */
export interface CaseAssetRecord {
  caseId: string;
  /** The path exactly as referenced inside the case's JSON files, e.g. "assets/suspects/001.webp". */
  assetPath: string;
  /**
   * Stored as raw bytes + an explicit MIME type rather than a native Blob.
   * IndexedDB's structured-clone support for Blob has historically been
   * inconsistent across browsers (and, incidentally, fake-indexeddb's test
   * implementation doesn't preserve Blob instances through a round-trip
   * either) — ArrayBuffer is unambiguous, so a Blob is reconstructed at
   * the point of use instead (see resolveCaseAssetUrl).
   */
  data: ArrayBuffer;
  mimeType: string;
}

/**
 * DOSSIER X local database.
 *
 * Per TECHNICAL_ARCHITECTURE.md this must remain a single local IndexedDB
 * database named DOSSIER_X. No server, no remote sync in v1.0.
 */
export class DossierDatabase extends Dexie {
  playerProfile!: EntityTable<PlayerProfile, "id">;
  settings!: EntityTable<AppSettings & { id: "singleton" }, "id">;
  notebook!: EntityTable<NotebookEntry, "id">;
  achievements!: EntityTable<AchievementRecord, "achievementId">;
  certificates!: EntityTable<CertificateRecord, "id">;
  installedCases!: EntityTable<InstalledCaseRecord, "caseId">;
  /** One record per installed case: the fully parsed, validated CaseBundle. */
  caseContent!: EntityTable<CaseBundle & { caseId: string }, "caseId">;
  /** Binary assets (images, PDFs, audio) for installed cases, keyed by [caseId+assetPath]. */
  caseAssets!: Table<CaseAssetRecord, [string, string]>;
  /** Which option the player selected per question — no correctness/grading, see the type's own doc comment. */
  questionAnswers!: Table<QuestionAnswerRecord, [string, string]>;

  constructor() {
    super("DOSSIER_X");

    this.version(1).stores({
      playerProfile: "id",
      settings: "id",
      notebook: "id, caseId, pinned, createdAt",
      achievements: "achievementId, unlockedAt",
      certificates: "id, caseId, issuedAt",
      installedCases: "caseId, status, lastOpenedAt",
    });

    // v2: case content + assets, now that CASE_SCHEMA.md defines their shape.
    // Dexie carries forward every v1 store unchanged automatically — only
    // new/changed stores need to be listed here.
    this.version(2).stores({
      caseContent: "caseId",
      caseAssets: "[caseId+assetPath], caseId",
    });

    // v3: recorded question answers.
    this.version(3).stores({
      questionAnswers: "[caseId+questionId], caseId",
    });
  }
}

/**
 * Lazily-created singleton. Dexie/IndexedDB only exist in the browser, so
 * this must never be instantiated during SSR — always access it through
 * `getDb()`, never import a top-level instance directly into a server
 * component.
 */
let dbInstance: DossierDatabase | null = null;

export function getDb(): DossierDatabase {
  if (typeof indexedDB === "undefined") {
    throw new Error(
      "getDb() was called outside a browser environment. IndexedDB is not available during SSR.",
    );
  }
  if (!dbInstance) {
    dbInstance = new DossierDatabase();
  }
  return dbInstance;
}

/**
 * Test-only: fully tears down the database so the next `getDb()` call starts
 * from a clean slate. Resetting just the JS singleton reference is *not*
 * sufficient — the underlying named IndexedDB database ("DOSSIER_X")
 * persists independently of the Dexie wrapper object, so a new instance
 * would still see old data unless the database itself is deleted first.
 */
export async function __resetDbInstanceForTests(): Promise<void> {
  if (dbInstance) {
    await dbInstance.delete();
  }
  dbInstance = null;
}
