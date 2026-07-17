import { z } from "zod";

export const VictimSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  age: z.number().positive(),
  occupation: z.string(),
  causeOfDeath: z.string(),
  timeOfDeath: z.string(),
  location: z.string(),
  photo: z.string().min(1),
});

export type Victim = z.infer<typeof VictimSchema>;
