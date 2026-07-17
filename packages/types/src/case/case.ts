import { z } from "zod";
import { DifficultySchema, CrimeTypeSchema, LocalizedTextSchema } from "./enums";

export const CaseSchema = z.object({
  id: z.string().min(1),
  title: LocalizedTextSchema,
  description: LocalizedTextSchema,
  category: CrimeTypeSchema,
  difficulty: DifficultySchema,
  estimatedMinutes: z.number().positive(),
});

export type Case = z.infer<typeof CaseSchema>;
