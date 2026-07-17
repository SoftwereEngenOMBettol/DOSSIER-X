import { describe, it, expect, afterEach } from "vitest";
import { mkdtemp, rm, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { FakeImageProvider } from "@dossier-x/image-provider";
import { runImagePipeline, type PipelineProgressEvent } from "../runImagePipeline";

let tempDirs: string[] = [];

async function makeTempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "dossier-pipeline-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(tempDirs.map((d) => rm(d, { recursive: true, force: true })));
  tempDirs = [];
});

describe("runImagePipeline", () => {
  it("generates real, valid WebP files at the correct paths for every request", async () => {
    const outputDir = await makeTempDir();
    const provider = new FakeImageProvider();

    const result = await runImagePipeline({
      provider,
      outputDir,
      throttleMs: 0,
      requests: [
        { targetPath: "suspects/001.webp", prompt: "a mugshot of suspect one" },
        { targetPath: "evidence/001.webp", prompt: "a bloody knife on a grey background" },
        { targetPath: "covers/cover.webp", prompt: "a cinematic museum cover" },
      ],
    });

    expect(result.succeeded).toHaveLength(3);
    expect(result.failed).toHaveLength(0);

    for (const asset of result.succeeded) {
      const fullPath = join(outputDir, asset.targetPath);
      const fileStat = await stat(fullPath);
      expect(fileStat.isFile()).toBe(true);

      // Confirm it's a REAL, decodable WebP — not just bytes with a .webp extension.
      const buffer = await readFile(fullPath);
      const metadata = await sharp(buffer).metadata();
      expect(metadata.format).toBe("webp");
    }
  });

  it("creates nested subdirectories automatically", async () => {
    const outputDir = await makeTempDir();
    const provider = new FakeImageProvider();

    await runImagePipeline({
      provider,
      outputDir,
      throttleMs: 0,
      requests: [{ targetPath: "deeply/nested/path/image.webp", prompt: "test" }],
    });

    const buffer = await readFile(join(outputDir, "deeply/nested/path/image.webp"));
    expect(buffer.length).toBeGreaterThan(0);
  });

  it("one failing image does not stop the rest of the batch from completing", async () => {
    const outputDir = await makeTempDir();
    const provider = new FakeImageProvider({ failPromptsContaining: "UNSAFE" });

    const result = await runImagePipeline({
      provider,
      outputDir,
      throttleMs: 0,
      requests: [
        { targetPath: "suspects/001.webp", prompt: "a normal suspect photo" },
        { targetPath: "suspects/002.webp", prompt: "an UNSAFE prompt that gets declined" },
        { targetPath: "suspects/003.webp", prompt: "another normal suspect photo" },
      ],
    });

    expect(result.succeeded).toHaveLength(2);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0]?.targetPath).toBe("suspects/002.webp");
    expect(result.failed[0]?.error).toMatch(/simulated failure/i);

    // The two successful ones actually made it to disk despite the failure in between.
    await expect(stat(join(outputDir, "suspects/001.webp"))).resolves.toBeTruthy();
    await expect(stat(join(outputDir, "suspects/003.webp"))).resolves.toBeTruthy();
    await expect(stat(join(outputDir, "suspects/002.webp"))).rejects.toThrow();
  });

  it("rejects a targetPath that doesn't end in .webp, before ever calling the provider", async () => {
    const outputDir = await makeTempDir();
    const provider = new FakeImageProvider();

    const result = await runImagePipeline({
      provider,
      outputDir,
      throttleMs: 0,
      requests: [{ targetPath: "suspects/001.png", prompt: "test" }],
    });

    expect(result.failed).toHaveLength(1);
    expect(result.failed[0]?.error).toMatch(/must end in \.webp/i);
    expect(provider.callLog).toHaveLength(0); // never even called the provider for a doomed request
  });

  it("resizes down when maxDimension is set and the image exceeds it", async () => {
    const outputDir = await makeTempDir();
    // Build a fake provider whose "generated" image is a real 800x600 PNG, so resize has something to do.
    const largeImage = await sharp({ create: { width: 800, height: 600, channels: 3, background: "red" } }).png().toBuffer();
    const provider: import("@dossier-x/image-provider").ImageProvider = {
      id: "large-fake",
      async generateImage() {
        return { data: largeImage, mimeType: "image/png" };
      },
    };

    await runImagePipeline({
      provider,
      outputDir,
      throttleMs: 0,
      requests: [{ targetPath: "evidence/001.webp", prompt: "test", maxDimension: 400 }],
    });

    const buffer = await readFile(join(outputDir, "evidence/001.webp"));
    const metadata = await sharp(buffer).metadata();
    expect(metadata.width).toBeLessThanOrEqual(400);
    expect(metadata.height).toBeLessThanOrEqual(400);
  });

  it("does NOT resize when maxDimension is omitted", async () => {
    const outputDir = await makeTempDir();
    const largeImage = await sharp({ create: { width: 800, height: 600, channels: 3, background: "blue" } }).png().toBuffer();
    const provider: import("@dossier-x/image-provider").ImageProvider = {
      id: "large-fake",
      async generateImage() {
        return { data: largeImage, mimeType: "image/png" };
      },
    };

    await runImagePipeline({
      provider,
      outputDir,
      throttleMs: 0,
      requests: [{ targetPath: "covers/cover.webp", prompt: "test" }],
    });

    const buffer = await readFile(join(outputDir, "covers/cover.webp"));
    const metadata = await sharp(buffer).metadata();
    expect(metadata.width).toBe(800);
    expect(metadata.height).toBe(600);
  });

  it("fires progress events in the correct order with correct indices", async () => {
    const outputDir = await makeTempDir();
    const provider = new FakeImageProvider({ failPromptsContaining: "FAIL" });
    const events: PipelineProgressEvent[] = [];

    await runImagePipeline({
      provider,
      outputDir,
      throttleMs: 0,
      onProgress: (e) => events.push(e),
      requests: [
        { targetPath: "a.webp", prompt: "ok" },
        { targetPath: "b.webp", prompt: "FAIL this one" },
      ],
    });

    expect(events.map((e) => `${e.index}:${e.status}`)).toEqual(["0:started", "0:succeeded", "1:started", "1:failed"]);
    expect(events.every((e) => e.total === 2)).toBe(true);
  });

  it("converts a non-PNG source format (e.g. JPEG) to WebP correctly", async () => {
    const outputDir = await makeTempDir();
    const jpegImage = await sharp({ create: { width: 200, height: 200, channels: 3, background: "green" } }).jpeg().toBuffer();
    const provider: import("@dossier-x/image-provider").ImageProvider = {
      id: "jpeg-fake",
      async generateImage() {
        return { data: jpegImage, mimeType: "image/jpeg" };
      },
    };

    await runImagePipeline({ provider, outputDir, throttleMs: 0, requests: [{ targetPath: "victim/victim.webp", prompt: "test" }] });

    const buffer = await readFile(join(outputDir, "victim/victim.webp"));
    const metadata = await sharp(buffer).metadata();
    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBe(200);
  });
});
