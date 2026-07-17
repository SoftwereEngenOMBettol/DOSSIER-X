import { ImageGenerationError, type ImageProvider, type GenerateImageOptions, type GeneratedImage } from "../ImageProvider";

/** A minimal valid 1x1 red PNG, hardcoded as bytes — real, decodable image data, not a placeholder string. */
const ONE_PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

export interface FakeImageProviderOptions {
  /** If set, generateImage rejects for prompts containing this substring — lets tests exercise the per-image failure path. */
  failPromptsContaining?: string;
  /** Simulated latency in ms, default 0. */
  delayMs?: number;
}

export class FakeImageProvider implements ImageProvider {
  readonly id = "fake";
  public readonly callLog: string[] = [];

  constructor(private readonly options: FakeImageProviderOptions = {}) {}

  async generateImage(prompt: string, _options?: GenerateImageOptions): Promise<GeneratedImage> {
    this.callLog.push(prompt);
    if (this.options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, this.options.delayMs));
    }
    if (this.options.failPromptsContaining && prompt.includes(this.options.failPromptsContaining)) {
      throw new ImageGenerationError(`Simulated failure for prompt containing "${this.options.failPromptsContaining}"`);
    }
    return { data: Buffer.from(ONE_PIXEL_PNG), mimeType: "image/png" };
  }
}
