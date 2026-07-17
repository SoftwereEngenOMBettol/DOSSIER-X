import { z } from "zod";

export const TimelineEventSchema = z.object({
  id: z.string().min(1),
  time: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
});

export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

export const TimelineFileSchema = z.array(TimelineEventSchema);
