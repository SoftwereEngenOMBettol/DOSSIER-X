import { z } from "zod";

export const DocumentRefSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  title: z.string().min(1),
  file: z.string().min(1),
});

export type DocumentRef = z.infer<typeof DocumentRefSchema>;

export const DocumentsFileSchema = z.array(DocumentRefSchema);
