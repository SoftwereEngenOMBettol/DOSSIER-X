import { z } from "zod";

export const DifficultySchema = z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const CrimeTypeSchema = z.enum([
  "Murder",
  "Missing Person",
  "Kidnapping",
  "Theft",
  "Fraud",
  "Cyber Crime",
  "Poisoning",
  "Corporate Crime",
  "Custom",
]);
export type CrimeType = z.infer<typeof CrimeTypeSchema>;

export const LocaleSchema = z.enum(["ar", "en"]);

/** A piece of text provided in both supported languages, e.g. case.json's title/description. */
export const LocalizedTextSchema = z.object({
  ar: z.string(),
  en: z.string(),
});
export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
