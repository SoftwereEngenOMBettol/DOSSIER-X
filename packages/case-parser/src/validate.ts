import {
  ManifestSchema,
  CaseSchema,
  VictimSchema,
  SuspectsFileSchema,
  WitnessesFileSchema,
  EvidenceFileSchema,
  CrimeSceneSchema,
  TimelineFileSchema,
  DocumentsFileSchema,
  QuestionsFileSchema,
  SolutionSchema,
  CertificateConfigSchema,
  AchievementsFileSchema,
  LocalizationFileSchema,
  AssetsIndexFileSchema,
  LicenseFileSchema,
  type Manifest,
  type Case,
  type Victim,
  type Suspect,
  type Witness,
  type Evidence,
  type CrimeScene,
  type TimelineEvent,
  type DocumentRef,
  type Question,
  type Solution,
  type CertificateConfig,
  type AchievementDef,
} from "@dossier-x/types";
import JSZip from "jszip";
import { loadZip, readJsonFile, type CasepackSource } from "./zip";

/** Package versions this build of the Player/Studio knows how to read. */
export const SUPPORTED_PACKAGE_VERSIONS = ["1.0"];

export interface CasepackValidationResult {
  valid: boolean;
  issues: string[];
  /** Only present when valid=true — every file, already parsed, ready to install without re-reading the archive. */
  parsed?: {
    manifest: Manifest;
    case: Case;
    victim: Victim;
    suspects: Suspect[];
    witnesses: Witness[];
    evidence: Evidence[];
    crimeScene: CrimeScene;
    timeline: TimelineEvent[];
    documents: DocumentRef[];
    questions: Question[];
    solution: Solution;
    certificate: CertificateConfig;
    achievements: AchievementDef[];
    localization: Record<string, unknown>;
    assetsIndex: Record<string, unknown>;
    license: Record<string, unknown>;
  };
}

const REQUIRED_JSON_FILES = [
  "manifest.json",
  "case.json",
  "victim.json",
  "suspects.json",
  "witnesses.json",
  "evidence.json",
  "crime_scene.json",
  "timeline.json",
  "documents.json",
  "questions.json",
  "solution.json",
  "certificate.json",
  "achievements.json",
  "localization.json",
  "assets.json",
  "license.json",
] as const;

/** Every field across all files that holds a path into assets/, so we can confirm they actually exist in the archive. */
function collectReferencedAssetPaths(parsed: NonNullable<CasepackValidationResult["parsed"]>): string[] {
  return [
    parsed.manifest.cover,
    parsed.victim.photo,
    ...parsed.suspects.map((s) => s.photo),
    ...parsed.witnesses.map((w) => w.photo),
    ...parsed.evidence.map((e) => e.image),
    ...parsed.crimeScene.images,
    ...parsed.documents.map((d) => d.file),
  ];
}

export async function validateCasepack(source: CasepackSource): Promise<CasepackValidationResult> {
  const zip = await loadZip(source);
  return validateCasepackZip(zip);
}

/** Same validation, but operates on an already-loaded JSZip — lets installCasepack validate and extract from one archive read instead of two. */
export async function validateCasepackZip(zip: JSZip): Promise<CasepackValidationResult> {
  const issues: string[] = [];

  // 1. Presence of every required top-level JSON file.
  for (const filename of REQUIRED_JSON_FILES) {
    if (!zip.file(filename)) {
      issues.push(`Missing required file: ${filename}`);
    }
  }
  if (issues.length > 0) {
    // Can't safely continue to schema validation if files are missing outright.
    return { valid: false, issues };
  }

  // 2. Read + parse JSON (corrupted JSON surfaces here).
  let rawByFile: Record<(typeof REQUIRED_JSON_FILES)[number], unknown>;
  try {
    const entries = await Promise.all(REQUIRED_JSON_FILES.map((f) => readJsonFile(zip, f)));
    rawByFile = Object.fromEntries(
      REQUIRED_JSON_FILES.map((f, i) => [f, entries[i]]),
    ) as typeof rawByFile;
  } catch (err) {
    issues.push(err instanceof Error ? err.message : String(err));
    return { valid: false, issues };
  }

  // 3. Schema validation, one file at a time, collecting every issue rather than stopping at the first.
  const manifestResult = ManifestSchema.safeParse(rawByFile["manifest.json"]);
  const caseResult = CaseSchema.safeParse(rawByFile["case.json"]);
  const victimResult = VictimSchema.safeParse(rawByFile["victim.json"]);
  const suspectsResult = SuspectsFileSchema.safeParse(rawByFile["suspects.json"]);
  const witnessesResult = WitnessesFileSchema.safeParse(rawByFile["witnesses.json"]);
  const evidenceResult = EvidenceFileSchema.safeParse(rawByFile["evidence.json"]);
  const crimeSceneResult = CrimeSceneSchema.safeParse(rawByFile["crime_scene.json"]);
  const timelineResult = TimelineFileSchema.safeParse(rawByFile["timeline.json"]);
  const documentsResult = DocumentsFileSchema.safeParse(rawByFile["documents.json"]);
  const questionsResult = QuestionsFileSchema.safeParse(rawByFile["questions.json"]);
  const solutionResult = SolutionSchema.safeParse(rawByFile["solution.json"]);
  const certificateResult = CertificateConfigSchema.safeParse(rawByFile["certificate.json"]);
  const achievementsResult = AchievementsFileSchema.safeParse(rawByFile["achievements.json"]);
  const localizationResult = LocalizationFileSchema.safeParse(rawByFile["localization.json"]);
  const assetsIndexResult = AssetsIndexFileSchema.safeParse(rawByFile["assets.json"]);
  const licenseResult = LicenseFileSchema.safeParse(rawByFile["license.json"]);

  const namedResults: Array<[string, { success: boolean; error?: { issues: Array<{ path: PropertyKey[]; message: string }> } }]> = [
    ["manifest.json", manifestResult],
    ["case.json", caseResult],
    ["victim.json", victimResult],
    ["suspects.json", suspectsResult],
    ["witnesses.json", witnessesResult],
    ["evidence.json", evidenceResult],
    ["crime_scene.json", crimeSceneResult],
    ["timeline.json", timelineResult],
    ["documents.json", documentsResult],
    ["questions.json", questionsResult],
    ["solution.json", solutionResult],
    ["certificate.json", certificateResult],
    ["achievements.json", achievementsResult],
    ["localization.json", localizationResult],
    ["assets.json", assetsIndexResult],
    ["license.json", licenseResult],
  ];

  for (const [filename, result] of namedResults) {
    if (!result.success) {
      for (const issue of result.error?.issues ?? []) {
        issues.push(`${filename} — ${issue.path.join(".")}: ${issue.message}`);
      }
    }
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  // From here on every safeParse succeeded, so `.data` is safe to read.
  const parsed: NonNullable<CasepackValidationResult["parsed"]> = {
    manifest: manifestResult.data as Manifest,
    case: caseResult.data as Case,
    victim: victimResult.data as Victim,
    suspects: suspectsResult.data as Suspect[],
    witnesses: witnessesResult.data as Witness[],
    evidence: evidenceResult.data as Evidence[],
    crimeScene: crimeSceneResult.data as CrimeScene,
    timeline: timelineResult.data as TimelineEvent[],
    documents: documentsResult.data as DocumentRef[],
    questions: questionsResult.data as Question[],
    solution: solutionResult.data as Solution,
    certificate: certificateResult.data as CertificateConfig,
    achievements: achievementsResult.data as AchievementDef[],
    localization: localizationResult.data as Record<string, unknown>,
    assetsIndex: assetsIndexResult.data as Record<string, unknown>,
    license: licenseResult.data as Record<string, unknown>,
  };

  // 4. Package version support.
  if (!SUPPORTED_PACKAGE_VERSIONS.includes(parsed.manifest.packageVersion)) {
    issues.push(
      `Unsupported package version "${parsed.manifest.packageVersion}". This app supports: ${SUPPORTED_PACKAGE_VERSIONS.join(", ")}.`,
    );
  }

  // 5. Every asset path referenced by the JSON must actually exist in the archive.
  for (const assetPath of collectReferencedAssetPaths(parsed)) {
    if (!zip.file(assetPath)) {
      issues.push(`Referenced asset is missing from the package: ${assetPath}`);
    }
  }

  // 6. id uniqueness within each array file, per CASE_SCHEMA.md's stated rule
  // ("every element in every file must have a unique, stable id").
  checkUniqueIds(parsed.suspects, "suspects.json", issues);
  checkUniqueIds(parsed.witnesses, "witnesses.json", issues);
  checkUniqueIds(parsed.evidence, "evidence.json", issues);
  checkUniqueIds(parsed.timeline, "timeline.json", issues);
  checkUniqueIds(parsed.documents, "documents.json", issues);
  checkUniqueIds(parsed.questions, "questions.json", issues);
  checkUniqueIds(parsed.achievements, "achievements.json", issues);

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  return { valid: true, issues: [], parsed };
}

function checkUniqueIds(items: Array<{ id: string }>, filename: string, issues: string[]): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      issues.push(`${filename} has a duplicate id: "${item.id}"`);
    }
    seen.add(item.id);
  }
}
