#!/usr/bin/env tsx
/**
 * Fully automated case image generation.
 *
 * Usage:
 *   GEMINI_API_KEY=your-key-here npx tsx generate-case-images.ts <path-to-image-requests.json> <output-assets-dir>
 *
 * Reads a structured manifest (see image-requests.example.json in this
 * folder for the shape), calls Gemini for every asset automatically,
 * converts each to WebP, writes it to the correct path, and reports a
 * summary. One failed image does not stop the rest — per-image errors
 * are collected and printed at the end so nothing fails silently.
 *
 * This does NOT read the API key from this file or any committed file —
 * it must be set as an environment variable. If you pasted a key into a
 * chat at any point, rotate it in Google AI Studio before using it here.
 */
import { readFile, writeFile } from "node:fs/promises";
import { GeminiImageProvider } from "@dossier-x/image-provider";
import { runImagePipeline, type AssetRequest } from "@dossier-x/image-pipeline";

interface ManifestEntry {
  targetPath: string;
  prompt: string;
  aspectRatio?: AssetRequest["aspectRatio"];
  maxDimension?: number;
}

async function main() {
  const [, , manifestPath, outputDir] = process.argv;

  if (!manifestPath || !outputDir) {
    console.error("Usage: npx tsx generate-case-images.ts <image-requests.json> <output-assets-dir>");
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "GEMINI_API_KEY is not set. Set it as an environment variable before running this " +
        '(e.g. "export GEMINI_API_KEY=your-key-here" or prefix the command with it). ' +
        "This script never reads a key from a file, on purpose.",
    );
    process.exit(1);
  }

  const manifestRaw = await readFile(manifestPath, "utf-8");
  const manifest: ManifestEntry[] = JSON.parse(manifestRaw);

  console.log(`Loaded ${manifest.length} asset requests from ${manifestPath}`);
  console.log(`Generating with Gemini (gemini-3.1-flash-image), writing WebP output to ${outputDir}\n`);

  const provider = new GeminiImageProvider({ apiKey });

  const result = await runImagePipeline({
    provider,
    outputDir,
    requests: manifest,
    onProgress: (event) => {
      const symbol = event.status === "succeeded" ? "\u2713" : event.status === "failed" ? "\u2717" : "\u2026";
      console.log(`  [${event.index + 1}/${event.total}] ${symbol} ${event.targetPath}`);
    },
  });

  console.log(`\nDone. ${result.succeeded.length} succeeded, ${result.failed.length} failed.`);

  if (result.failed.length > 0) {
    console.log("\nFailed assets (still present as whatever placeholder was already on disk):");
    for (const f of result.failed) {
      console.log(`  - ${f.targetPath}: ${f.error}`);
    }
    const reportPath = `${outputDir}/../generation-errors.json`;
    await writeFile(reportPath, JSON.stringify(result.failed, null, 2));
    console.log(`\nFull error details written to ${reportPath}`);
  }

  process.exit(result.failed.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
