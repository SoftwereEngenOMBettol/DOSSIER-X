import { z } from "zod";
import { DifficultySchema, LocalizedTextSchema } from "../case/enums";

/**
 * A storefront listing for one case — enough to render its Archive card,
 * Purchase Dialog, and locked Certificate/Achievement entries WITHOUT
 * that case ever having been imported. This is deliberately a much
 * thinner shape than CaseBundle: no suspects, no evidence, no solution —
 * just what's needed to say "here's a case, here's roughly what's in it,
 * here's how to buy it."
 *
 * `stats` is optional per-field because cases that haven't been built yet
 * (see PHASE_3_NOTES.md) genuinely don't have final counts — showing a
 * specific number we'd have to change later is worse than an honest
 * "not yet available" state.
 */
export const CaseCatalogStatsSchema = z.object({
  evidenceCount: z.number().nonnegative().optional(),
  documentCount: z.number().nonnegative().optional(),
  witnessCount: z.number().nonnegative().optional(),
  suspectCount: z.number().nonnegative().optional(),
  achievementCount: z.number().nonnegative().optional(),
});
export type CaseCatalogStats = z.infer<typeof CaseCatalogStatsSchema>;

export const CaseCatalogEntrySchema = z.object({
  id: z.string().min(1),
  title: LocalizedTextSchema,
  tagline: LocalizedTextSchema.optional(),
  difficulty: DifficultySchema,
  estimatedMinutes: z.number().positive(),
  /** Preview cover shown on the storefront card, served from the app's own public/ folder — NOT the .casepack's cover (which doesn't exist locally until the case is installed). */
  previewCover: z.string().min(1),
  stats: CaseCatalogStatsSchema,
  /** Shown in the Purchase Dialog and, once solved, on the Certificates page. Undefined until the case is built and this is finalized. */
  certificateTitle: z.string().optional(),
  /**
   * True for the case(s) that ship bundled with the app and install
   * automatically on first launch — currently just DX001. Everything
   * else requires purchase + manual import.
   */
  bundledFree: z.boolean().default(false),
  /** Set to false for entries still in production — renders as "Coming Soon" rather than a purchasable locked card. */
  releaseReady: z.boolean().default(true),
  /** Real achievement titles, only populated for cases that have actually been built — undefined for not-yet-built cases rather than invented placeholder names. */
  achievementTitles: z.array(z.string()).optional(),
});
export type CaseCatalogEntry = z.infer<typeof CaseCatalogEntrySchema>;

export const CaseCatalogSchema = z.array(CaseCatalogEntrySchema);
export type CaseCatalog = z.infer<typeof CaseCatalogSchema>;

/** store-config.json's shape — purely the editable purchase links, kept separate from catalog content per the "one settings file for links" requirement. */
export const StoreConfigSchema = z.object({
  purchaseUrls: z.record(z.string().url()),
});
export type StoreConfig = z.infer<typeof StoreConfigSchema>;
