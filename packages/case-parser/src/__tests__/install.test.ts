import { describe, it, expect, beforeEach } from "vitest";
import { __resetDbInstanceForTests, getCaseContent, getCaseAssetBlob, listInstalledCases, resolveCaseAssetUrl } from "@dossier-x/storage";
import { installCasepack } from "../install";
import { CasepackValidationError } from "../errors";
import { buildFixtureCasepack, FIXTURE_CASE_ID } from "./fixtures/buildFixtureCasepack";

beforeEach(async () => {
  await __resetDbInstanceForTests();
});

describe("installCasepack", () => {
  it("installs a valid package and returns its id and title", async () => {
    const casepack = await buildFixtureCasepack();
    const result = await installCasepack(casepack);
    expect(result.caseId).toBe(FIXTURE_CASE_ID);
    expect(result.title).toBe("Test Fixture Case");
  });

  it("stores the fully parsed case content, readable afterward", async () => {
    const casepack = await buildFixtureCasepack();
    await installCasepack(casepack);

    const content = await getCaseContent(FIXTURE_CASE_ID);
    expect(content).toBeDefined();
    expect(content?.case.title.en).toBe("Test Fixture Case");
    expect(content?.suspects).toHaveLength(1);
    expect(content?.suspects[0]?.name).toBe("Test Suspect A");
  });

  it("stores every asset under assets/ as a retrievable Blob", async () => {
    const casepack = await buildFixtureCasepack();
    await installCasepack(casepack);

    const coverBlob = await getCaseAssetBlob(FIXTURE_CASE_ID, "assets/covers/cover.webp");
    expect(coverBlob).toBeInstanceOf(Blob);
    expect(coverBlob?.size).toBeGreaterThan(0);

    const suspectPhoto = await getCaseAssetBlob(FIXTURE_CASE_ID, "assets/suspects/001.webp");
    expect(suspectPhoto).toBeInstanceOf(Blob);
  });

  it("registers the case in installedCases with status 'owned'", async () => {
    const casepack = await buildFixtureCasepack();
    await installCasepack(casepack);

    const installed = await listInstalledCases();
    expect(installed).toHaveLength(1);
    expect(installed[0]?.caseId).toBe(FIXTURE_CASE_ID);
    expect(installed[0]?.status).toBe("owned");
    expect(installed[0]?.lastOpenedAt).toBeNull();
  });

  it("refuses to install an invalid package and writes nothing to storage", async () => {
    const casepack = await buildFixtureCasepack({ omitSolutionFile: true });
    await expect(installCasepack(casepack)).rejects.toBeInstanceOf(CasepackValidationError);

    const installed = await listInstalledCases();
    expect(installed).toHaveLength(0);
  });

  it("the validation error carries the specific list of issues", async () => {
    const casepack = await buildFixtureCasepack({ omitSolutionFile: true });
    try {
      await installCasepack(casepack);
      expect.unreachable("installCasepack should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(CasepackValidationError);
      const validationError = err as CasepackValidationError;
      expect(validationError.issues.some((i) => i.includes("solution.json"))).toBe(true);
    }
  });

  describe("reinstalling with updated assets (regression: stale blob: URL cache)", () => {
    it("resolveCaseAssetUrl reflects new bytes after a reinstall, not the first import's cached URL", async () => {
      const v1Bytes = new Uint8Array([1, 2, 3, 4]);
      const v2Bytes = new Uint8Array([9, 9, 9, 9, 9, 9]);

      await installCasepack(await buildFixtureCasepack({ coverAssetBytes: v1Bytes }));

      // Simulate the app having already displayed the cover once — this is
      // exactly what populates the module-level object-URL cache in a real
      // session, and is the precondition for the bug this test guards
      // against.
      const urlAfterFirstInstall = await resolveCaseAssetUrl(FIXTURE_CASE_ID, "assets/covers/cover.webp");
      expect(urlAfterFirstInstall).not.toBeNull();

      // Re-import the "same" case, as a player would after regenerating
      // images and running the repack tool.
      await installCasepack(await buildFixtureCasepack({ coverAssetBytes: v2Bytes }));

      const blobAfterReinstall = await getCaseAssetBlob(FIXTURE_CASE_ID, "assets/covers/cover.webp");
      expect(blobAfterReinstall!.size).toBe(v2Bytes.length);

      // The critical assertion: resolving the URL again after reinstall
      // must NOT return the exact same cached URL string from before —
      // that cached string points at a Blob holding v1's bytes forever,
      // regardless of what IndexedDB now contains.
      const urlAfterReinstall = await resolveCaseAssetUrl(FIXTURE_CASE_ID, "assets/covers/cover.webp");
      expect(urlAfterReinstall).not.toBe(urlAfterFirstInstall);
    });
  });
});
