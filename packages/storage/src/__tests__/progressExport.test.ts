import { describe, it, expect, beforeEach } from "vitest";
import { __resetDbInstanceForTests } from "../db";
import { createPlayerProfile } from "../repositories/playerProfile";
import { updateSettings } from "../repositories/settings";
import { addNote } from "../repositories/notebook";
import { exportProgress, importProgress, ProgressImportError, resetAllProgress } from "../repositories/progressExport";
import { getPlayerProfile } from "../repositories/playerProfile";
import { listNotesForCase } from "../repositories/notebook";

beforeEach(async () => {
  await __resetDbInstanceForTests();
});

describe("progress export/import", () => {
  it("exports the current state in the documented envelope shape", async () => {
    await createPlayerProfile({ name: "Ahmed", locale: "en" });
    const bundle = await exportProgress();
    expect(bundle.exportFormat).toBe("dossier-x-progress");
    expect(bundle.exportVersion).toBe(1);
    expect(bundle.data.playerProfile?.name).toBe("Ahmed");
  });

  it("round-trips profile, settings, and notebook data through export -> import", async () => {
    await createPlayerProfile({ name: "Ahmed", locale: "en" });
    await updateSettings({ locale: "ar" });
    await addNote({ caseId: "DX001", text: "The maintenance supervisor lied about his shift." });

    const bundle = await exportProgress();

    // Simulate a fresh install / different browser profile
    await resetAllProgress();

    await importProgress(bundle);

    const profile = await getPlayerProfile();
    const notes = await listNotesForCase("DX001");
    expect(profile?.name).toBe("Ahmed");
    expect(notes).toHaveLength(1);
    expect(notes[0]?.text).toContain("maintenance supervisor");
  });

  it("rejects a file that is not a DOSSIER X progress export", async () => {
    await expect(importProgress({ foo: "bar" })).rejects.toBeInstanceOf(ProgressImportError);
  });

  it("rejects an unsupported export version", async () => {
    await expect(
      importProgress({ exportFormat: "dossier-x-progress", exportVersion: 99, data: {} }),
    ).rejects.toBeInstanceOf(ProgressImportError);
  });
});
