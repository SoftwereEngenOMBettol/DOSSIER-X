import type { CaseBundle } from "@dossier-x/types";
import { getDb } from "../db";

export async function getCaseContent(caseId: string): Promise<CaseBundle | undefined> {
  const record = await getDb().caseContent.get(caseId);
  if (!record) return undefined;
  const { caseId: _caseId, ...bundle } = record;
  return bundle;
}

export async function putCaseContent(caseId: string, bundle: CaseBundle): Promise<void> {
  await getDb().caseContent.put({ caseId, ...bundle });
}

export async function deleteCaseContent(caseId: string): Promise<void> {
  await getDb().caseContent.delete(caseId);
}
