/**
 * The contract every image-generation backend implements. The pipeline
 * (packages/image-pipeline) only ever talks to this interface — swapping
 * Gemini for OpenAI, Flux, or anything else later means writing one new
 * class, not touching the pipeline.
 */

export type AspectRatio = "1:1" | "3:4" | "4:3" | "2:3" | "3:2" | "4:5" | "5:4" | "9:16" | "16:9";

export interface GenerateImageOptions {
  /** Defaults to a provider-specific sensible value if omitted. */
  aspectRatio?: AspectRatio;
}

export interface GeneratedImage {
  /** Raw image bytes, exactly as returned by the provider — not yet converted to WebP. */
  data: Buffer;
  /** The provider's actual output format, e.g. "image/png". The pipeline converts this to WebP itself. */
  mimeType: string;
}

/**
 * Thrown for any failure a caller should treat as "this specific image
 * failed" — missing key, provider error, network failure, content
 * refusal. The pipeline catches this per-image so one failure doesn't
 * abort the whole case (per the "show a clear error, don't stop the rest
 * of generation" requirement).
 */
export class ImageGenerationError extends Error {
  constructor(
    message: string,
    public override readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ImageGenerationError";
  }
}

export interface ImageProvider {
  /** A short, stable identifier for logging/UI, e.g. "gemini". */
  readonly id: string;

  /**
   * Generates one image from a text prompt. Implementations MUST throw
   * ImageGenerationError (not a generic Error) on failure, so the
   * pipeline can distinguish "this image failed, keep going" from a
   * genuine programming bug.
   */
  generateImage(prompt: string, options?: GenerateImageOptions): Promise<GeneratedImage>;
}
