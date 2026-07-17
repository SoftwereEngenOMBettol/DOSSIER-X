import { getDb } from "../db";
import { DEFAULT_SETTINGS } from "./settings";
import type {
  PlayerProfile,
  AppSettings,
  NotebookEntry,
  AchievementRecord,
  CertificateRecord,
  InstalledCaseRecord,
} from "@dossier-x/types";

/**
 * Schema for the portable backup file produced by Settings → Export Progress.
 * This is entirely separate from the `.casepack` format: a `.casepack` is
 * case CONTENT distributed by the Studio; this file is the PLAYER'S local
 * save data, for backing up or moving progress between devices/browsers.
 */
export interface ProgressExportV1 {
  exportFormat: "dossier-x-progress";
  exportVersion: 1;
  exportedAt: string;
  data: {
    playerProfile: PlayerProfile | undefined;
    settings: AppSettings;
    notebook: NotebookEntry[];
    achievements: AchievementRecord[];
    certificates: CertificateRecord[];
    installedCases: InstalledCaseRecord[];
  };
}

export async function exportProgress(): Promise<ProgressExportV1> {
  const db = getDb();
  const [playerProfile, settingsRow, notebook, achievements, certificates, installedCases] =
    await Promise.all([
      db.playerProfile.get("local-player"),
      db.settings.get("singleton"),
      db.notebook.toArray(),
      db.achievements.toArray(),
      db.certificates.toArray(),
      db.installedCases.toArray(),
    ]);

  const settings: AppSettings = settingsRow
    ? (({ id: _id, ...rest }) => rest)(settingsRow)
    : DEFAULT_SETTINGS;

  return {
    exportFormat: "dossier-x-progress",
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    data: { playerProfile, settings, notebook, achievements, certificates, installedCases },
  };
}

export class ProgressImportError extends Error {}

/**
 * Validates and replaces local progress data with the contents of a backup
 * file. This is a destructive, whole-database replace within the tracked
 * stores — callers should confirm with the player before invoking this
 * (Settings screen already gates this behind a confirmation dialog).
 */
export async function importProgress(payload: unknown): Promise<void> {
  if (
    typeof payload !== "object" ||
    payload === null ||
    (payload as Record<string, unknown>).exportFormat !== "dossier-x-progress"
  ) {
    throw new ProgressImportError("This file is not a valid DOSSIER X progress export.");
  }

  const parsed = payload as ProgressExportV1;
  if (parsed.exportVersion !== 1) {
    throw new ProgressImportError(`Unsupported progress export version: ${String(parsed.exportVersion)}`);
  }

  const db = getDb();
  await db.transaction(
    "rw",
    [db.playerProfile, db.settings, db.notebook, db.achievements, db.certificates, db.installedCases],
    async () => {
      await Promise.all([
        db.playerProfile.clear(),
        db.settings.clear(),
        db.notebook.clear(),
        db.achievements.clear(),
        db.certificates.clear(),
        db.installedCases.clear(),
      ]);

      if (parsed.data.playerProfile) await db.playerProfile.put(parsed.data.playerProfile);
      await db.settings.put({ id: "singleton", ...parsed.data.settings });
      if (parsed.data.notebook.length) await db.notebook.bulkPut(parsed.data.notebook);
      if (parsed.data.achievements.length) await db.achievements.bulkPut(parsed.data.achievements);
      if (parsed.data.certificates.length) await db.certificates.bulkPut(parsed.data.certificates);
      if (parsed.data.installedCases.length) await db.installedCases.bulkPut(parsed.data.installedCases);
    },
  );
}

/** Wipes all local player data. Used by Settings → Reset Progress. */
export async function resetAllProgress(): Promise<void> {
  const db = getDb();
  await db.transaction(
    "rw",
    [db.playerProfile, db.notebook, db.achievements, db.certificates, db.installedCases],
    async () => {
      await Promise.all([
        db.playerProfile.clear(),
        db.notebook.clear(),
        db.achievements.clear(),
        db.certificates.clear(),
        db.installedCases.clear(),
      ]);
    },
  );
}
