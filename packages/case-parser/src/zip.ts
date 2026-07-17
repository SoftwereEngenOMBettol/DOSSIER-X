import JSZip from "jszip";
import { CasepackReadError } from "./errors";

export type CasepackSource = File | Blob;

export async function loadZip(source: CasepackSource): Promise<JSZip> {
  try {
    return await JSZip.loadAsync(source);
  } catch (err) {
    throw new CasepackReadError(
      `Could not open this file as a .casepack archive. It may be corrupted or not a ZIP file. (${
        err instanceof Error ? err.message : String(err)
      })`,
    );
  }
}

/** Reads and JSON.parses one file from the archive. Returns `undefined` if the file is absent. */
export async function readJsonFile(zip: JSZip, path: string): Promise<unknown> {
  const entry = zip.file(path);
  if (!entry) return undefined;

  const text = await entry.async("text");
  try {
    return JSON.parse(text) as unknown;
  } catch (err) {
    throw new CasepackReadError(
      `${path} is not valid JSON. (${err instanceof Error ? err.message : String(err)})`,
    );
  }
}

/** Reads a binary file (image, PDF, audio) from the archive as raw bytes. */
export async function readBinaryFile(zip: JSZip, path: string): Promise<ArrayBuffer | undefined> {
  const entry = zip.file(path);
  if (!entry) return undefined;
  return entry.async("arraybuffer");
}

const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
};

/** Best-effort MIME type from a file's extension, for reconstructing a correctly-typed Blob later. */
export function guessMimeType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return MIME_TYPES_BY_EXTENSION[ext] ?? "application/octet-stream";
}

/** Lists every file path inside the archive under a given prefix (e.g. "assets/"). */
export function listFilesUnder(zip: JSZip, prefix: string): string[] {
  const paths: string[] = [];
  zip.forEach((relativePath, entry) => {
    if (!entry.dir && relativePath.startsWith(prefix)) {
      paths.push(relativePath);
    }
  });
  return paths;
}
