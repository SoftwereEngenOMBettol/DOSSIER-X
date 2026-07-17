import { getDb } from "../db";

export async function putCaseAsset(
  caseId: string,
  assetPath: string,
  data: ArrayBuffer,
  mimeType: string,
): Promise<void> {
  await getDb().caseAssets.put({ caseId, assetPath, data, mimeType });
}

export async function getCaseAssetBlob(caseId: string, assetPath: string): Promise<Blob | undefined> {
  const record = await getDb().caseAssets.get([caseId, assetPath]);
  if (!record) return undefined;
  return new Blob([record.data], { type: record.mimeType });
}

export async function deleteCaseAssets(caseId: string): Promise<void> {
  await getDb().caseAssets.where("caseId").equals(caseId).delete();
}

/**
 * Object URL cache so repeated lookups of the same asset (e.g. a suspect's
 * photo shown in both a grid card and a detail panel) don't create a new
 * blob: URL — and therefore a new memory allocation — every render.
 * Callers do not need to revoke these manually; call
 * `revokeAllCaseAssetUrls()` when a case is uninstalled or the app resets.
 */
const objectUrlCache = new Map<string, string>();

function cacheKey(caseId: string, assetPath: string): string {
  return `${caseId}:${assetPath}`;
}

/**
 * Resolves a path exactly as it appears inside a case's JSON files (e.g.
 * Suspect.photo = "assets/suspects/001.webp") to a browser-usable object
 * URL. Returns null if the asset isn't stored (e.g. a package that
 * referenced a file it didn't actually include — validation should have
 * already caught this, but this stays defensive).
 */
export async function resolveCaseAssetUrl(caseId: string, assetPath: string): Promise<string | null> {
  const key = cacheKey(caseId, assetPath);
  const cached = objectUrlCache.get(key);
  if (cached) return cached;

  const blob = await getCaseAssetBlob(caseId, assetPath);
  if (!blob) return null;

  const url = URL.createObjectURL(blob);
  objectUrlCache.set(key, url);
  return url;
}

export function revokeAllCaseAssetUrls(): void {
  for (const url of objectUrlCache.values()) {
    URL.revokeObjectURL(url);
  }
  objectUrlCache.clear();
}

/**
 * Revokes and clears cached object URLs for a single case, without
 * touching any other installed case's cache. Must be called whenever a
 * case is (re)installed — otherwise a reinstall with updated assets
 * silently keeps serving the previous import's stale blob: URLs, since
 * those URLs point at the specific Blob they were created from, not a
 * live reference to whatever is currently in IndexedDB.
 */
export function revokeCaseAssetUrls(caseId: string): void {
  const prefix = `${caseId}:`;
  for (const [key, url] of objectUrlCache.entries()) {
    if (key.startsWith(prefix)) {
      URL.revokeObjectURL(url);
      objectUrlCache.delete(key);
    }
  }
}
