import { z } from "zod";

export const SuspectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  age: z.number().positive(),
  occupation: z.string(),
  relationship: z.string(),
  motive: z.string(),
  photo: z.string().min(1),
  /**
   * Optional narrative depth fields, not in CASE_SCHEMA.md v1's example.
   * Added additively for richer commercial cases — every field the schema
   * actually requires is untouched above, so a case that omits these is
   * still fully valid. Revisit once a v2 schema formalizes this content.
   */
  biography: z.string().optional(),
  alibi: z.string().optional(),
  secret: z.string().optional(),
});

export type Suspect = z.infer<typeof SuspectSchema>;

export const SuspectsFileSchema = z.array(SuspectSchema);
