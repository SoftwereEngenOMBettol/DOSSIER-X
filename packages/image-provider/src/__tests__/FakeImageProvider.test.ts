import { describe, it, expect } from "vitest";
import { FakeImageProvider } from "../providers/FakeImageProvider";
import { ImageGenerationError } from "../ImageProvider";

describe("FakeImageProvider", () => {
  it("returns real, decodable PNG bytes", async () => {
    const provider = new FakeImageProvider();
    const result = await provider.generateImage("a red apple");
    expect(result.mimeType).toBe("image/png");
    // PNG magic bytes: 89 50 4E 47
    expect(result.data[0]).toBe(0x89);
    expect(result.data[1]).toBe(0x50);
    expect(result.data[2]).toBe(0x4e);
    expect(result.data[3]).toBe(0x47);
  });

  it("logs every prompt it was called with, in order", async () => {
    const provider = new FakeImageProvider();
    await provider.generateImage("prompt one");
    await provider.generateImage("prompt two");
    expect(provider.callLog).toEqual(["prompt one", "prompt two"]);
  });

  it("can simulate a per-image failure without crashing the caller", async () => {
    const provider = new FakeImageProvider({ failPromptsContaining: "BROKEN" });
    await expect(provider.generateImage("a BROKEN prompt")).rejects.toThrow(ImageGenerationError);
    // A different prompt still succeeds — proves failures are per-call, not global.
    const result = await provider.generateImage("a fine prompt");
    expect(result.data.length).toBeGreaterThan(0);
  });
});
