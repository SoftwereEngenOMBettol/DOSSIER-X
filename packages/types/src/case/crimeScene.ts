import { z } from "zod";

export const CrimeSceneSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  images: z.array(z.string().min(1)),
});

export type CrimeScene = z.infer<typeof CrimeSceneSchema>;
