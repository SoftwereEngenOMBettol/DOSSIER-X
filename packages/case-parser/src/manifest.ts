import { ManifestSchema, type Manifest } from "@dossier-x/types";
import { loadZip, readJsonFile, type CasepackSource } from "./zip";
import { CasepackReadError } from "./errors";

/**
 * Reads and parses manifest.json from a .casepack archive.
 * Per TECHNICAL_ARCHITECTURE.md: "The manifest is always loaded first."
 */
export async function readManifest(source: CasepackSource): Promise<Manifest> {
  const zip = await loadZip(source);
  const raw = await readJsonFile(zip, "manifest.json");
  if (raw === undefined) {
    throw new CasepackReadError("manifest.json is missing from this package.");
  }
  const result = ManifestSchema.safeParse(raw);
  if (!result.success) {
    throw new CasepackReadError(
      `manifest.json does not match the expected format: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    );
  }
  return result.data;
}
