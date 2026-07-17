import { describe, it, expect } from "vitest";
import { readManifest } from "../manifest";
import { CasepackReadError } from "../errors";
import { buildFixtureCasepack, FIXTURE_CASE_ID } from "./fixtures/buildFixtureCasepack";

describe("readManifest", () => {
  it("reads and validates a well-formed manifest.json", async () => {
    const casepack = await buildFixtureCasepack();
    const manifest = await readManifest(casepack);
    expect(manifest.id).toBe(FIXTURE_CASE_ID);
    expect(manifest.title).toBe("Test Fixture Case");
    expect(manifest.difficulty).toBe("Beginner");
    expect(manifest.language).toEqual(["en"]);
  });

  it("throws CasepackReadError when the manifest fails schema validation", async () => {
    const casepack = await buildFixtureCasepack({
      manifestOverrides: { difficulty: "Not A Real Difficulty" as never },
    });
    await expect(readManifest(casepack)).rejects.toBeInstanceOf(CasepackReadError);
  });

  it("throws CasepackReadError for a file that isn't a valid ZIP", async () => {
    const notAZip = new Blob(["definitely not a zip file"]);
    await expect(readManifest(notAZip)).rejects.toBeInstanceOf(CasepackReadError);
  });
});
