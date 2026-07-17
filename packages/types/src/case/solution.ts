import { z } from "zod";

/**
 * solution.json — per CASE_PACKAGE_SPEC.md and CASE_SCHEMA.md, this file
 * is never displayed to the player. Only used by validation/scoring logic,
 * which itself is pending the v2 relationships spec — for now this type
 * exists so Studio can author it and the parser can validate its presence,
 * without any engine acting on it yet.
 */
export const SolutionSchema = z.object({
  killer: z.string().min(1), // references a Suspect.id
  weapon: z.string().min(1),
  motive: z.string().min(1),
  perfectScore: z.number().positive(),
});

export type Solution = z.infer<typeof SolutionSchema>;
