import { z } from "zod";

export const WitnessSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  statement: z.string(),
  reliability: z.number().min(0).max(100),
  photo: z.string().min(1),
  /** Optional — same rationale as Suspect's narrative extensions. */
  contradictions: z.string().optional(),
});

export type Witness = z.infer<typeof WitnessSchema>;

export const WitnessesFileSchema = z.array(WitnessSchema);
