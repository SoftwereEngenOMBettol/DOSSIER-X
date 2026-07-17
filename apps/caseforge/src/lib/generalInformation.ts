import type { Difficulty, CrimeType } from "@dossier-x/types";
import { DIFFICULTY_OPTIONS, CRIME_TYPE_OPTIONS } from "./wizardOptions";

export type { Difficulty, CrimeType };
export { DIFFICULTY_OPTIONS, CRIME_TYPE_OPTIONS };

/**
 * Fields for the wizard's General Information step, matching the documented
 * list exactly: case name (ar/en), description, cover, difficulty,
 * estimated time, crime type, keywords, version number.
 *
 * This is deliberately NOT persisted to IndexedDB or wired into
 * case-parser/.casepack export — Studio has no documented storage layer
 * yet (see PHASE_1_NOTES.md §6), and export requires the full case
 * schema, which is still pending. It exists to demonstrate the documented
 * wizard flow and is held in-memory only for the duration of the page.
 */
export interface GeneralInformationFields {
  titleAr: string;
  titleEn: string;
  description: string;
  coverFileName: string | null;
  difficulty: Difficulty;
  estimatedTimeMinutes: number;
  crimeType: CrimeType;
  keywords: string;
  version: string;
}

export const emptyGeneralInformation: GeneralInformationFields = {
  titleAr: "",
  titleEn: "",
  description: "",
  coverFileName: null,
  difficulty: "Beginner",
  estimatedTimeMinutes: 60,
  crimeType: "Murder",
  keywords: "",
  version: "1.0.0",
};
