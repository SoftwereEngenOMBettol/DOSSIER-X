import { describe, it, expect, beforeEach } from "vitest";
import { __resetDbInstanceForTests } from "../db";
import { createPlayerProfile, getPlayerProfile, updatePlayerProfile } from "../repositories/playerProfile";
import { getSettings, updateSettings, resetSettings, DEFAULT_SETTINGS } from "../repositories/settings";

beforeEach(async () => {
  await __resetDbInstanceForTests();
});

describe("playerProfile repository", () => {
  it("returns undefined before any profile is created", async () => {
    const profile = await getPlayerProfile();
    expect(profile).toBeUndefined();
  });

  it("creates a profile with sensible defaults", async () => {
    const profile = await createPlayerProfile({ name: "Ahmed", locale: "en" });
    expect(profile.name).toBe("Ahmed");
    expect(profile.locale).toBe("en");
    expect(profile.rank).toBe("Junior Detective");
    expect(profile.xp).toBe(0);
    expect(profile.casesSolved).toBe(0);
  });

  it("persists the created profile and can read it back", async () => {
    await createPlayerProfile({ name: "Ahmed", locale: "en" });
    const fetched = await getPlayerProfile();
    expect(fetched?.name).toBe("Ahmed");
  });

  it("updates only the given fields", async () => {
    await createPlayerProfile({ name: "Ahmed", locale: "en" });
    const updated = await updatePlayerProfile({ xp: 250, casesSolved: 1 });
    expect(updated.xp).toBe(250);
    expect(updated.casesSolved).toBe(1);
    expect(updated.name).toBe("Ahmed"); // untouched field survives the patch
  });

  it("throws when updating a profile that does not exist yet", async () => {
    await expect(updatePlayerProfile({ xp: 10 })).rejects.toThrow();
  });
});

describe("settings repository", () => {
  it("returns defaults when nothing has been saved yet", async () => {
    const settings = await getSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it("persists a partial update on top of defaults", async () => {
    await updateSettings({ locale: "ar", masterVolume: 40 });
    const settings = await getSettings();
    expect(settings.locale).toBe("ar");
    expect(settings.masterVolume).toBe(40);
    // Untouched fields still reflect defaults
    expect(settings.theme).toBe(DEFAULT_SETTINGS.theme);
  });

  it("resetSettings restores exact defaults", async () => {
    await updateSettings({ locale: "ar", masterVolume: 5 });
    const reset = await resetSettings();
    expect(reset).toEqual(DEFAULT_SETTINGS);
  });
});
