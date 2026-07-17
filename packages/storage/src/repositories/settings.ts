import type { AppSettings } from "@dossier-x/types";
import { getDb } from "../db";

const SETTINGS_ID = "singleton" as const;

export const DEFAULT_SETTINGS: AppSettings = {
  locale: "en",
  theme: "dark",
  soundEnabled: true,
  musicEnabled: true,
  masterVolume: 80,
  musicVolume: 60,
  sfxVolume: 90,
  autosaveEnabled: true,
  confirmBeforeExit: true,
  showCompletedTags: true,
};

export async function getSettings(): Promise<AppSettings> {
  const record = await getDb().settings.get(SETTINGS_ID);
  if (!record) return DEFAULT_SETTINGS;
  const { id: _id, ...settings } = record;
  return settings;
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const db = getDb();
  const current = await getSettings();
  const next: AppSettings = { ...current, ...patch };
  await db.settings.put({ id: SETTINGS_ID, ...next });
  return next;
}

export async function resetSettings(): Promise<AppSettings> {
  const db = getDb();
  await db.settings.put({ id: SETTINGS_ID, ...DEFAULT_SETTINGS });
  return DEFAULT_SETTINGS;
}
