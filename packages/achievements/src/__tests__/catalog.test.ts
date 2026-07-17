import { describe, it, expect } from "vitest";
import type { CertificateRecord, NotebookEntry } from "@dossier-x/types";
import { computeAllAchievements, ACHIEVEMENT_CATALOG } from "../catalog";

function cert(overrides: Partial<CertificateRecord> = {}): CertificateRecord {
  return {
    id: "c1",
    caseId: "DX001",
    caseTitle: "Test Case",
    playerName: "Ahmed",
    rank: "Master Detective",
    score: 85,
    timeTakenSeconds: 5000,
    difficulty: "Intermediate",
    issuedAt: "2026-01-01T00:00:00.000Z",
    certificateNumber: "DX001-01012026",
    ...overrides,
  };
}

function note(overrides: Partial<NotebookEntry> = {}): NotebookEntry {
  return {
    id: "n1",
    caseId: "DX001",
    text: "a clue",
    pinned: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("computeAllAchievements", () => {
  it("everything is locked with zero data", () => {
    const results = computeAllAchievements({ certificates: [], notes: [] });
    expect(results).toHaveLength(ACHIEVEMENT_CATALOG.length);
    expect(results.every((r) => !r.unlocked)).toBe(true);
    expect(results.find((r) => r.id === "first_case_solved")?.current).toBe(0);
  });

  it("first_case_solved unlocks with exactly one certificate", () => {
    const results = computeAllAchievements({ certificates: [cert()], notes: [] });
    const a = results.find((r) => r.id === "first_case_solved")!;
    expect(a.unlocked).toBe(true);
    expect(a.current).toBe(1);
    expect(a.target).toBe(1);
  });

  it("perfect_investigation only unlocks with an actual 100% score, not just any certificate", () => {
    const notPerfect = computeAllAchievements({ certificates: [cert({ score: 99 })], notes: [] });
    expect(notPerfect.find((r) => r.id === "perfect_investigation")?.unlocked).toBe(false);

    const perfect = computeAllAchievements({ certificates: [cert({ score: 100 })], notes: [] });
    expect(perfect.find((r) => r.id === "perfect_investigation")?.unlocked).toBe(true);
  });

  it("speed_investigator requires a genuinely fast time, and ignores a 0-second placeholder", () => {
    const zeroTime = computeAllAchievements({ certificates: [cert({ timeTakenSeconds: 0 })], notes: [] });
    expect(zeroTime.find((r) => r.id === "speed_investigator")?.unlocked).toBe(false);

    const slow = computeAllAchievements({ certificates: [cert({ timeTakenSeconds: 7200 })], notes: [] });
    expect(slow.find((r) => r.id === "speed_investigator")?.unlocked).toBe(false);

    const fast = computeAllAchievements({ certificates: [cert({ timeTakenSeconds: 1800 })], notes: [] });
    expect(fast.find((r) => r.id === "speed_investigator")?.unlocked).toBe(true);
  });

  it("note_taker tracks progress toward 5 without overshooting past the target", () => {
    const threeNotes = computeAllAchievements({ certificates: [], notes: [note(), note(), note()] });
    const a = threeNotes.find((r) => r.id === "note_taker")!;
    expect(a.current).toBe(3);
    expect(a.unlocked).toBe(false);

    const tenNotes = computeAllAchievements({ certificates: [], notes: Array.from({ length: 10 }, () => note()) });
    const b = tenNotes.find((r) => r.id === "note_taker")!;
    expect(b.current).toBe(5); // capped at target, not 10
    expect(b.unlocked).toBe(true);
  });

  it("case_master and legendary_detective scale correctly with multiple certificates", () => {
    const fourCerts = computeAllAchievements({
      certificates: [cert({ caseId: "DX001" }), cert({ caseId: "DX002" }), cert({ caseId: "DX003" }), cert({ caseId: "DX004" })],
      notes: [],
    });
    expect(fourCerts.find((r) => r.id === "case_master")?.unlocked).toBe(false);
    expect(fourCerts.find((r) => r.id === "case_master")?.current).toBe(4);

    const fiveCerts = computeAllAchievements({
      certificates: Array.from({ length: 5 }, (_, i) => cert({ caseId: `DX00${i + 1}` })),
      notes: [],
    });
    expect(fiveCerts.find((r) => r.id === "case_master")?.unlocked).toBe(true);
    expect(fiveCerts.find((r) => r.id === "legendary_detective")?.unlocked).toBe(false); // needs 7
  });

  it("every achievement has a valid category and positive xp", () => {
    for (const def of ACHIEVEMENT_CATALOG) {
      expect(["Investigation", "Collection", "Skill", "Special"]).toContain(def.category);
      expect(def.xp).toBeGreaterThan(0);
    }
  });
});
