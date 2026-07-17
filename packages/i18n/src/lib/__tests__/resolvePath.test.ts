import { describe, it, expect } from "vitest";
import { resolvePath, type Dictionary } from "../resolvePath";

const dict: Dictionary = {
  app: { name: "DOSSIER X" },
  nested: { deeply: { value: "found it" } },
};

describe("resolvePath", () => {
  it("resolves a single-level key", () => {
    expect(resolvePath({ hello: "world" }, "hello")).toBe("world");
  });

  it("resolves a nested dot-path", () => {
    expect(resolvePath(dict, "app.name")).toBe("DOSSIER X");
  });

  it("resolves a deeply nested dot-path", () => {
    expect(resolvePath(dict, "nested.deeply.value")).toBe("found it");
  });

  it("falls back to the raw path when the key is missing, instead of throwing", () => {
    expect(resolvePath(dict, "does.not.exist")).toBe("does.not.exist");
  });

  it("falls back to the raw path when a middle segment resolves to a string, not an object", () => {
    // "app.name.oops" tries to walk *through* a string leaf — must not throw.
    expect(resolvePath(dict, "app.name.oops")).toBe("app.name.oops");
  });

  it("falls back to the raw path for an empty dictionary", () => {
    expect(resolvePath({}, "anything.here")).toBe("anything.here");
  });
});
