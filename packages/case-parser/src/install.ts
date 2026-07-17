import type { CaseBundle, InstalledCaseRecord } from "@dossier-x/types";
import { putCaseContent, putCaseAsset, upsertInstalledCase, revokeCaseAssetUrls, getInstalledCase } from "@dossier-x/storage";
import { loadZip, readBinaryFile, listFilesUnder, guessMimeType, type CasepackSource } from "./zip";
import { validateCasepackZip } from "./validate";
import { CasepackValidationError } from "./errors";

export interface InstallResult {
  caseId: string;
  title: string;
}

/**
 * Full install pipeline per TECHNICAL_ARCHITECTURE.md's "Investigation Flow":
 * Extract -> Validate -> Install -> IndexedDB -> Archive.
 *
 * Every file under assets/ is copied into IndexedDB as a Blob — not just
 * the specific paths referenced by JSON fields — so future updates to a
 * case's JSON (e.g. a v1.1 patch adding a new document that points at an
 * asset already present in v1.0's package) don't require re-uploading
 * unchanged binary assets.
 */
export async function installCasepack(source: CasepackSource): Promise<InstallResult> {
  const zip = await loadZip(source);
  const result = await validateCasepackZip(zip);

  if (!result.valid || !result.parsed) {
    throw new CasepackValidationError(result.issues);
  }

  const { parsed } = result;
  const caseId = parsed.manifest.id;

  // Clear any cached blob: URLs from a previous install of this case BEFORE
  // writing new bytes. These URLs are tied to the specific Blob they were
  // created from, not a live reference to IndexedDB — without this, a
  // reinstall with updated images/PDFs would silently keep showing the
  // previous import's content forever, even though the new bytes are
  // correctly written below.
  revokeCaseAssetUrls(caseId);

  const bundle: CaseBundle = {
    manifest: parsed.manifest,
    case: parsed.case,
    victim: parsed.victim,
    suspects: parsed.suspects,
    witnesses: parsed.witnesses,
    evidence: parsed.evidence,
    crimeScene: parsed.crimeScene,
    timeline: parsed.timeline,
    documents: parsed.documents,
    questions: parsed.questions,
    solution: parsed.solution,
    certificate: parsed.certificate,
    achievements: parsed.achievements,
    localization: parsed.localization,
    assetsIndex: parsed.assetsIndex,
    license: parsed.license,
  };

  // Copy every file under assets/ into IndexedDB as raw bytes + MIME type.
  const assetPaths = listFilesUnder(zip, "assets/");
  await Promise.all(
    assetPaths.map(async (path) => {
      const data = await readBinaryFile(zip, path);
      if (data) await putCaseAsset(caseId, path, data, guessMimeType(path));
    }),
  );

  await putCaseContent(caseId, bundle);

  // A reinstall (e.g. re-importing to pick up updated images/documents,
  // exactly as the repack-images workflow does) must NOT reset a player's
  // progress. Only a genuinely first-time install starts these fields
  // fresh — otherwise updating art on an in-progress or already-completed
  // case would silently wipe that out.
  const existing = await getInstalledCase(caseId);
  const now = new Date().toISOString();
  const record: InstalledCaseRecord = existing
    ? { ...existing, installedVersion: parsed.manifest.version }
    : { caseId, installedVersion: parsed.manifest.version, installedAt: now, lastOpenedAt: null, startedAt: null, status: "owned" };
  await upsertInstalledCase(record);

  return { caseId, title: parsed.manifest.title };
}
