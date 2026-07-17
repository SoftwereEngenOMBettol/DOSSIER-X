import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  question: z.string().min(1),
  /** Present for multiple_choice (the only type with a documented shape). */
  options: z.array(z.string()).optional(),
  /** Present for multiple_choice. Other question types' answer shape is undocumented. */
  answer: z.string().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

export const QuestionsFileSchema = z.array(QuestionSchema);
