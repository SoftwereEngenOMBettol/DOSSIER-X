import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { ImageGenerationError, type ImageProvider, type AspectRatio } from "@dossier-x/image-provider";

export interface AssetRequest {
  /** The prompt sent to the provider. */
  prompt: string;
  /** Path relative to the case's assets/ folder, e.g. "suspects/001.webp" — MUST end in .webp; the pipeline converts to this regardless of what the provider returns. */
  targetPath: string;
  aspectRatio?: AspectRatio;
  /** If the generated image's longest side exceeds this, it's downscaled before saving. Omit for no resize. */
  maxDimension?: number;
}

export interface AssetResult {
  targetPath: string;
  prompt: string;
}

export interface AssetFailure {
  targetPath: string;
  prompt: string;
  error: string;
}

export interface PipelineResult {
  succeeded: AssetResult[];
  failed: AssetFailure[];
}

export interface PipelineProgressEvent {
  targetPath: string;
  status: "started" | "succeeded" | "failed";
  index: number;
  total: number;
}

export interface RunPipelineOptions {
  provider: ImageProvider;
  requests: AssetRequest[];
  /** Absolute path to the case's assets/ folder. Subdirectories (suspects/, evidence/, etc.) are created automatically. */
  outputDir: string;
  onProgress?: (event: PipelineProgressEvent) => void;
  /** Milliseconds to wait between requests, to stay comfortably under rate limits on large batches. Default 250. */
  throttleMs?: number;
}

/**
 * Generates every requested asset and writes it to disk as WebP.
 *
 * Deliberately does NOT throw on an individual image failing — per the
 * requirement that a missing/exhausted provider should surface a clear
 * error for that asset without halting the rest of case generation. The
 * caller inspects `failed` afterward and decides what to do (retry,
 * warn the user, fall back to a placeholder).
 */
export async function runImagePipeline(options: RunPipelineOptions): Promise<PipelineResult> {
  const { provider, requests, outputDir, onProgress, throttleMs = 250 } = options;
  const succeeded: AssetResult[] = [];
  const failed: AssetFailure[] = [];

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i]!;
    onProgress?.({ targetPath: request.targetPath, status: "started", index: i, total: requests.length });

    try {
      if (!request.targetPath.endsWith(".webp")) {
        throw new ImageGenerationError(`targetPath must end in .webp, got "${request.targetPath}"`);
      }

      const generated = await provider.generateImage(request.prompt, { aspectRatio: request.aspectRatio });

      let pipeline = sharp(generated.data);
      if (request.maxDimension) {
        pipeline = pipeline.resize({
          width: request.maxDimension,
          height: request.maxDimension,
          fit: "inside",
          withoutEnlargement: true,
        });
      }
      const webpBuffer = await pipeline.webp({ quality: 90 }).toBuffer();

      const fullPath = join(outputDir, request.targetPath);
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(fullPath, webpBuffer);

      succeeded.push({ targetPath: request.targetPath, prompt: request.prompt });
      onProgress?.({ targetPath: request.targetPath, status: "succeeded", index: i, total: requests.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failed.push({ targetPath: request.targetPath, prompt: request.prompt, error: message });
      onProgress?.({ targetPath: request.targetPath, status: "failed", index: i, total: requests.length });
    }

    if (throttleMs > 0 && i < requests.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, throttleMs));
    }
  }

  return { succeeded, failed };
}
