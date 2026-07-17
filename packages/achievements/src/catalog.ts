import type { CertificateRecord, NotebookEntry } from "@dossier-x/types";

export type AchievementCategory = "Investigation" | "Collection" | "Skill" | "Special";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  xp: number;
  /** Computes {current, target} from real player data. Never fabricated — every achievement here is backed by data this app actually records. */
  computeProgress: (data: { certificates: CertificateRecord[]; notes: NotebookEntry[] }) => { current: number; target: number };
}

export const ACHIEVEMENT_CATALOG: AchievementDef[] = [
  {
    id: "first_case_solved",
    title: "First Case Solved",
    description: "Solve your first case.",
    category: "Investigation",
    xp: 10,
    computeProgress: ({ certificates }) => ({ current: Math.min(certificates.length, 1), target: 1 }),
  },
  {
    id: "perfect_investigation",
    title: "Perfect Investigation",
    description: "Solve a case with a perfect 100% score.",
    category: "Skill",
    xp: 50,
    computeProgress: ({ certificates }) => ({ current: certificates.some((c) => c.score === 100) ? 1 : 0, target: 1 }),
  },
  {
    id: "speed_investigator",
    title: "Speed Investigator",
    description: "Solve a case in under 60 minutes.",
    category: "Skill",
    xp: 25,
    computeProgress: ({ certificates }) => ({
      current: certificates.some((c) => c.timeTakenSeconds > 0 && c.timeTakenSeconds < 3600) ? 1 : 0,
      target: 1,
    }),
  },
  {
    id: "note_taker",
    title: "Note Taker",
    description: "Write 5 notes in your notebook.",
    category: "Collection",
    xp: 15,
    computeProgress: ({ notes }) => ({ current: Math.min(notes.length, 5), target: 5 }),
  },
  {
    id: "case_master",
    title: "Case Master",
    description: "Solve 5 cases.",
    category: "Investigation",
    xp: 75,
    computeProgress: ({ certificates }) => ({ current: Math.min(certificates.length, 5), target: 5 }),
  },
  {
    id: "legendary_detective",
    title: "Legendary Detective",
    description: "Solve every case in the DOSSIER X archive.",
    category: "Special",
    xp: 200,
    computeProgress: ({ certificates }) => ({ current: Math.min(certificates.length, 7), target: 7 }),
  },
];

export interface AchievementProgress extends AchievementDef {
  current: number;
  target: number;
  unlocked: boolean;
}

export function computeAllAchievements(data: {
  certificates: CertificateRecord[];
  notes: NotebookEntry[];
}): AchievementProgress[] {
  return ACHIEVEMENT_CATALOG.map((def) => {
    const { current, target } = def.computeProgress(data);
    return { ...def, current, target, unlocked: current >= target };
  });
}
