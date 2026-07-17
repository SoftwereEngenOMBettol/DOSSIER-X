import { ImageGenerationError, type ImageProvider, type GenerateImageOptions, type GeneratedImage } from "../ImageProvider";

const INTERACTIONS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";

/** Nano Banana 2 — Google's current recommended general-purpose image model as of mid-2026. Imagen (the older dedicated image API) is deprecated and shuts down August 17, 2026 — this deliberately does NOT use it. */
const DEFAULT_MODEL = "gemini-3.1-flash-image";

interface InteractionsResponse {
  output_image?: { data: string; mime_type?: string };
  steps?: Array<{
    type: string;
    content?: Array<{ type: string; data?: string; mime_type?: string; text?: string }>;
  }>;
}

export interface GeminiImageProviderConfig {
  /** Never hardcode a real key here or anywhere in source — always sourced from the environment at call time. */
  apiKey: string;
  model?: string;
  fetchImpl?: typeof fetch;
}

export class GeminiImageProvider implements ImageProvider {
  readonly id = "gemini";
  private readonly apiKey: string;
  private readonly model: string;
  private readonly fetchImpl: typeof fetch;

  constructor(config: GeminiImageProviderConfig) {
    if (!config.apiKey) {
      throw new ImageGenerationError(
        "GeminiImageProvider requires an API key. Set GEMINI_API_KEY in your environment — never hardcode it in source.",
      );
    }
    this.apiKey = config.apiKey;
    this.model = config.model ?? DEFAULT_MODEL;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  async generateImage(prompt: string, options?: GenerateImageOptions): Promise<GeneratedImage> {
    let response: Response;
    try {
      response = await this.fetchImpl(INTERACTIONS_URL, {
        method: "POST",
        headers: {
          "x-goog-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          input: [{ type: "text", text: prompt }],
          response_format: {
            type: "image",
            mime_type: "image/png",
            aspect_ratio: options?.aspectRatio ?? "1:1",
          },
        }),
      });
    } catch (err) {
      throw new ImageGenerationError(`Network error calling Gemini: ${err instanceof Error ? err.message : String(err)}`, err);
    }

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      throw new ImageGenerationError(`Gemini API returned ${response.status}: ${bodyText.slice(0, 500)}`);
    }

    const json = (await response.json()) as InteractionsResponse;
    const extracted = extractImage(json);
    if (!extracted) {
      throw new ImageGenerationError(
        "Gemini responded successfully but no image was found in the output — the model may have declined this prompt. Try rewording it.",
      );
    }

    return {
      data: Buffer.from(extracted.data, "base64"),
      mimeType: extracted.mime_type ?? "image/png",
    };
  }
}

/** output_image is a convenience property for simple cases; complex/interleaved responses need to be found by walking steps, per Gemini's own documented behavior. */
function extractImage(json: InteractionsResponse): { data: string; mime_type?: string } | null {
  if (json.output_image?.data) return json.output_image;

  for (const step of json.steps ?? []) {
    if (step.type !== "model_output") continue;
    for (const block of step.content ?? []) {
      if (block.type === "image" && block.data) {
        return { data: block.data, mime_type: block.mime_type };
      }
    }
  }
  return null;
}
