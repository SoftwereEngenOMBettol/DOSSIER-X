import { z } from "zod";

export const AchievementDefSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  xp: z.number().nonnegative(),
});

export type AchievementDef = z.infer<typeof AchievementDefSchema>;

export const AchievementsFileSchema = z.array(AchievementDefSchema);
