import { z } from "zod";

export const EvidenceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1),
  description: z.string(),
  image: z.string().min(1),
  /**
   * Raw trigger identifier (e.g. "crime_scene_complete"). Deliberately
   * untyped beyond `string` — the vocabulary and resolution mechanics for
   * this field are explicitly pending a "CASE_SCHEMA v2 – Relationships &
   * Investigation Logic" document. Nothing in this codebase resolves or
   * acts on this value yet; it is stored as-is for forward compatibility.
   */
  unlockTrigger: z.string(),
  /** Optional — where the item was found. Mentioned in ADMIN_AND_PLAYER_SYSTEM.md's evidence field list but not in CASE_SCHEMA.md's minimal example; added additively. */
  location: z.string().optional(),
});

export type Evidence = z.infer<typeof EvidenceSchema>;

export const EvidenceFileSchema = z.array(EvidenceSchema);
