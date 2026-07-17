import type { AchievementRecord, CertificateRecord, LocalId } from "@dossier-x/types";
import { getDb } from "../db";

export async function listAchievementRecords(): Promise<AchievementRecord[]> {
  return getDb().achievements.toArray();
}

export async function upsertAchievementRecord(record: AchievementRecord): Promise<void> {
  await getDb().achievements.put(record);
}

export async function listCertificates(): Promise<CertificateRecord[]> {
  return getDb().certificates.toArray();
}

function generateId(): LocalId {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `cert-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function addCertificate(
  input: Omit<CertificateRecord, "id" | "issuedAt">,
): Promise<CertificateRecord> {
  const record: CertificateRecord = {
    ...input,
    id: generateId(),
    issuedAt: new Date().toISOString(),
  };
  await getDb().certificates.put(record);
  return record;
}
