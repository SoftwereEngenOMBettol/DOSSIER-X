import { z } from "zod";
import { ManifestSchema } from "./manifest";
import { CaseSchema } from "./case";
import { VictimSchema } from "./victim";
import { SuspectsFileSchema } from "./suspect";
import { WitnessesFileSchema } from "./witness";
import { EvidenceFileSchema } from "./evidence";
import { CrimeSceneSchema } from "./crimeScene";
import { TimelineFileSchema } from "./timeline";
import { DocumentsFileSchema } from "./document";
import { QuestionsFileSchema } from "./question";
import { SolutionSchema } from "./solution";
import { CertificateConfigSchema } from "./certificate";
import { AchievementsFileSchema } from "./achievement";
import { LocalizationFileSchema, AssetsIndexFileSchema, LicenseFileSchema } from "./unspecified";

/**
 * The complete, validated contents of one installed .casepack, minus the
 * binary assets themselves (those are stored separately as Blobs — see
 * packages/storage's caseAssets store — and referenced here only by the
 * relative paths already present in each file, e.g. Suspect.photo).
 */
export const CaseBundleSchema = z.object({
  manifest: ManifestSchema,
  case: CaseSchema,
  victim: VictimSchema,
  suspects: SuspectsFileSchema,
  witnesses: WitnessesFileSchema,
  evidence: EvidenceFileSchema,
  crimeScene: CrimeSceneSchema,
  timeline: TimelineFileSchema,
  documents: DocumentsFileSchema,
  questions: QuestionsFileSchema,
  solution: SolutionSchema,
  certificate: CertificateConfigSchema,
  achievements: AchievementsFileSchema,
  localization: LocalizationFileSchema,
  assetsIndex: AssetsIndexFileSchema,
  license: LicenseFileSchema,
});

export type CaseBundle = z.infer<typeof CaseBundleSchema>;
