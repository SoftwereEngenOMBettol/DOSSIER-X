import { describe, it, expect } from "vitest";
import { validateCasepack, SUPPORTED_PACKAGE_VERSIONS } from "../validate";
import { buildFixtureCasepack } from "./fixtures/buildFixtureCasepack";

describe("validateCasepack", () => {
  it("accepts a well-formed package", async () => {
    const casepack = await buildFixtureCasepack();
    const result = await validateCasepack(casepack);
    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
    expect(result.parsed?.manifest.id).toBe("DXTEST");
    expect(result.parsed?.suspects).toHaveLength(1);
  });

  it("rejects a package missing a required file (solution.json)", async () => {
    const casepack = await buildFixtureCasepack({ omitSolutionFile: true });
    const result = await validateCasepack(casepack);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("solution.json"))).toBe(true);
  });

  it("rejects a package with corrupted JSON", async () => {
    const casepack = await buildFixtureCasepack({ corruptQuestionsJson: true });
    const result = await validateCasepack(casepack);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("questions.json"))).toBe(true);
  });

  it("rejects a package referencing an asset that isn't actually included", async () => {
    const casepack = await buildFixtureCasepack({ omitCrimeSceneAsset: true });
    const result = await validateCasepack(casepack);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("crime_scene"))).toBe(true);
  });

  it("rejects an unsupported package version", async () => {
    const casepack = await buildFixtureCasepack({ manifestOverrides: { packageVersion: "99.0" } });
    const result = await validateCasepack(casepack);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("Unsupported package version"))).toBe(true);
  });

  it("confirms what package versions are currently supported", () => {
    expect(SUPPORTED_PACKAGE_VERSIONS).toContain("1.0");
  });

  it("rejects a manifest with an invalid difficulty value", async () => {
    const casepack = await buildFixtureCasepack({
      manifestOverrides: { difficulty: "Impossible" as never },
    });
    const result = await validateCasepack(casepack);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.startsWith("manifest.json"))).toBe(true);
  });
});
