import type { InstalledCaseRecord } from "@dossier-x/types";
import { getDb } from "../db";

export async function listInstalledCases(): Promise<InstalledCaseRecord[]> {
  return getDb().installedCases.toArray();
}

export async function getInstalledCase(caseId: string): Promise<InstalledCaseRecord | undefined> {
  return getDb().installedCases.get(caseId);
}

export async function upsertInstalledCase(record: InstalledCaseRecord): Promise<void> {
  await getDb().installedCases.put(record);
}

export async function markCaseOpened(caseId: string): Promise<void> {
  const db = getDb();
  const existing = await db.installedCases.get(caseId);
  if (!existing) return;
  const isFirstOpen = existing.startedAt === null;
  await db.installedCases.put({
    ...existing,
    lastOpenedAt: new Date().toISOString(),
    startedAt: existing.startedAt ?? new Date().toISOString(),
    status: isFirstOpen && existing.status === "owned" ? "in_progress" : existing.status,
  });
}

export async function markCaseCompleted(caseId: string): Promise<void> {
  const db = getDb();
  const existing = await db.installedCases.get(caseId);
  if (!existing) return;
  await db.installedCases.put({ ...existing, status: "completed" });
}
