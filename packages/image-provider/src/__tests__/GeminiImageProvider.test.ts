import { describe, it, expect, vi } from "vitest";
import { GeminiImageProvider } from "../providers/GeminiImageProvider";
import { ImageGenerationError } from "../ImageProvider";

function fakeFetchResponse(body: unknown, ok = true, status = 200): typeof fetch {
  return vi.fn(async () =>
    ({
      ok,
      status,
      json: async () => body,
      text: async () => JSON.stringify(body),
    }) as unknown as Response,
  ) as unknown as typeof fetch;
}

describe("GeminiImageProvider", () => {
  it("throws immediately if constructed without an API key, rather than failing later at call time", () => {
    expect(() => new GeminiImageProvider({ apiKey: "" })).toThrow(ImageGenerationError);
  });

  it("sends the request to the correct endpoint, with the correct header and current (non-deprecated) model", async () => {
    const fetchImpl = fakeFetchResponse({ output_image: { data: "AAAA", mime_type: "image/png" } });
    const provider = new GeminiImageProvider({ apiKey: "test-key-123", fetchImpl });

    await provider.generateImage("a red apple on a table");

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/interactions");
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-key-123");

    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("gemini-3.1-flash-image"); // NOT an Imagen model — Imagen is deprecated Aug 2026
    expect(body.input[0].text).toBe("a red apple on a table");
    expect(body.response_format.type).toBe("image");
  });

  it("extracts output_image.data for the simple response shape", async () => {
    const fetchImpl = fakeFetchResponse({ output_image: { data: "aGVsbG8=", mime_type: "image/jpeg" } });
    const provider = new GeminiImageProvider({ apiKey: "k", fetchImpl });

    const result = await provider.generateImage("test");
    expect(result.mimeType).toBe("image/jpeg");
    expect(result.data.toString("utf-8")).toBe("hello"); // base64 "aGVsbG8=" decodes to "hello"
  });

  it("falls back to walking steps[] for interleaved/complex responses, per Gemini's documented response shape", async () => {
    const fetchImpl = fakeFetchResponse({
      steps: [
        { type: "thought", content: [{ type: "text", text: "thinking..." }] },
        {
          type: "model_output",
          content: [
            { type: "text", text: "Here is your image" },
            { type: "image", data: "d29ybGQ=", mime_type: "image/png" }, // "world"
          ],
        },
      ],
    });
    const provider = new GeminiImageProvider({ apiKey: "k", fetchImpl });

    const result = await provider.generateImage("test");
    expect(result.data.toString("utf-8")).toBe("world");
  });

  it("throws ImageGenerationError (not a generic error) on a non-2xx response, with the status included", async () => {
    const fetchImpl = fakeFetchResponse({ error: "quota exceeded" }, false, 429);
    const provider = new GeminiImageProvider({ apiKey: "k", fetchImpl });

    await expect(provider.generateImage("test")).rejects.toThrow(ImageGenerationError);
    await expect(provider.generateImage("test")).rejects.toThrow(/429/);
  });

  it("throws a clear ImageGenerationError when the API succeeds but no image comes back (e.g. content declined)", async () => {
    const fetchImpl = fakeFetchResponse({ steps: [{ type: "model_output", content: [{ type: "text", text: "I can't generate that." }] }] });
    const provider = new GeminiImageProvider({ apiKey: "k", fetchImpl });

    await expect(provider.generateImage("test")).rejects.toThrow(/no image was found/i);
  });

  it("wraps a network-level failure (fetch itself throwing) in ImageGenerationError", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("getaddrinfo ENOTFOUND");
    }) as unknown as typeof fetch;
    const provider = new GeminiImageProvider({ apiKey: "k", fetchImpl });

    await expect(provider.generateImage("test")).rejects.toThrow(ImageGenerationError);
    await expect(provider.generateImage("test")).rejects.toThrow(/network error/i);
  });
});
