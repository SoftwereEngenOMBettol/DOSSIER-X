#!/usr/bin/env node
/**
 * Swaps real images into an existing .casepack file.
 * Usage: node repack-images.mjs <original.casepack> <new-images-folder> <output.casepack>
 * See README.md in this folder for a full walkthrough.
 */
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import JSZip from "jszip";

async function collectFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, base)));
    } else {
      files.push(relative(base, fullPath).split("\\").join("/")); // normalize Windows path separators
    }
  }
  return files;
}

/** Strips leading zeros from the numeric part of a filename so "001.webp" and "1.webp" are treated as the same asset. Non-numeric filenames (cover.webp, victim.webp) pass through unchanged. */
function normalizeNumericFilename(relativePath) {
  const parts = relativePath.split("/");
  const filename = parts.pop();
  const match = filename.match(/^0*(\d+)(\.\w+)$/);
  const normalizedFilename = match ? `${match[1]}${match[2]}` : filename;
  return [...parts, normalizedFilename].join("/");
}

async function main() {
  const [, , casepackPath, imagesFolder, outputPath] = process.argv;

  if (!casepackPath || !imagesFolder || !outputPath) {
    console.error("Usage: node repack-images.mjs <original.casepack> <new-images-folder> <output.casepack>");
    process.exit(1);
  }

  console.log(`Reading ${casepackPath}...`);
  const originalBuffer = await readFile(casepackPath);
  const zip = await JSZip.loadAsync(originalBuffer);

  // Index every assets/ path in the existing package by its normalized
  // form, so "assets/crime_scene/001.webp" and "assets/crime_scene/1.webp"
  // resolve to the same entry regardless of which side has the padding.
  const archiveIndex = new Map();
  zip.forEach((relPath) => {
    if (relPath.startsWith("assets/") && !relPath.endsWith("/")) {
      archiveIndex.set(normalizeNumericFilename(relPath), relPath);
    }
  });

  console.log(`Scanning ${imagesFolder}...`);
  const newImagePaths = await collectFiles(imagesFolder);

  if (newImagePaths.length === 0) {
    console.error(`No files found in ${imagesFolder}. Nothing to replace.`);
    process.exit(1);
  }

  let replacedCount = 0;
  let skippedCount = 0;

  for (const relativePath of newImagePaths) {
    const archivePath = `assets/${relativePath}`;
    const normalizedArchivePath = normalizeNumericFilename(archivePath);
    const matchedPath = archiveIndex.get(normalizedArchivePath);

    if (!matchedPath) {
      console.warn(`  ! Skipping "${relativePath}" — no matching path "${archivePath}" in the package. Check spelling/location.`);
      skippedCount++;
      continue;
    }

    const newImageData = await readFile(join(imagesFolder, relativePath));
    zip.file(matchedPath, newImageData);
    console.log(`  \u2713 Replaced ${matchedPath}${matchedPath !== archivePath ? ` (matched from "${relativePath}")` : ""}`);
    replacedCount++;
  }

  console.log(`Writing ${outputPath}...`);
  const outputBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  await writeFile(outputPath, outputBuffer);

  console.log("");
  console.log(`Done. ${replacedCount} image(s) replaced, ${skippedCount} skipped.`);
  if (skippedCount > 0) {
    console.log("Skipped files didn't match any path already in the package — double-check folder names and file extensions.");
  }
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
