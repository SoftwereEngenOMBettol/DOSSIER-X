import { describe, it, expect } from "vitest";
import en from "../../locales/en.json";
import ar from "../../locales/ar.json";
import type { Dictionary } from "../resolvePath";

/** Recursively collects every leaf dot-path in a dictionary, e.g. "sidebar.archive". */
function collectPaths(dict: Dictionary, prefix = ""): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(dict)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      paths.push(path);
    } else {
      paths.push(...collectPaths(value, path));
    }
  }
  return paths;
}

describe("translation dictionary parity", () => {
  const enPaths = collectPaths(en).sort();
  const arPaths = collectPaths(ar).sort();

  it("en.json and ar.json define exactly the same set of keys", () => {
    const missingFromAr = enPaths.filter((p) => !arPaths.includes(p));
    const missingFromEn = arPaths.filter((p) => !enPaths.includes(p));

    expect(missingFromAr, "keys present in en.json but missing from ar.json").toEqual([]);
    expect(missingFromEn, "keys present in ar.json but missing from en.json").toEqual([]);
  });

  it("neither dictionary has empty string values", () => {
    const emptyInEn = enPaths.filter((p) => resolveLeaf(en, p) === "");
    const emptyInAr = arPaths.filter((p) => resolveLeaf(ar, p) === "");
    expect(emptyInEn).toEqual([]);
    expect(emptyInAr).toEqual([]);
  });
});

function resolveLeaf(dict: Dictionary, path: string): string {
  const parts = path.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : "";
}
