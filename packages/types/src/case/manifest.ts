import { z } from "zod";
import { DifficultySchema, LocaleSchema } from "./enums";

/**
 * manifest.json — always the first file read from a .casepack.
 *
 * Deliberately a PLAIN string `title`, not the {ar,en} localized object
 * used in case.json — that's exactly what CASE_SCHEMA.md specifies, not
 * an oversight. The manifest is for quick engine-level identification
 * (Archive card sorting/filtering); the full localized content lives in
 * case.json.
 */
export const ManifestSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  title: z.string().min(1),
  difficulty: DifficultySchema,
  estimatedTime: z.number().positive(),
  author: z.string(),
  language: z.array(LocaleSchema).min(1),
  cover: z.string().min(1),
  packageVersion: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Manifest = z.infer<typeof ManifestSchema>;
