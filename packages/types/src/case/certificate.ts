import { z } from "zod";

export const CertificateConfigSchema = z.object({
  title: z.string().min(1),
  template: z.string().min(1),
  minimumScore: z.number().min(0).max(100),
});

export type CertificateConfig = z.infer<typeof CertificateConfigSchema>;
