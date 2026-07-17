import JSZip from "jszip";
import type {
  Manifest,
  Case,
  Victim,
  Suspect,
  Witness,
  Evidence,
  CrimeScene,
  TimelineEvent,
  DocumentRef,
  Question,
  Solution,
  CertificateConfig,
  AchievementDef,
} from "@dossier-x/types";

/**
 * A deliberately minimal, generic sample case used only to test the
 * parser/validator/installer pipeline. Not intended to resemble a real
 * commercial DOSSIER X investigation.
 */
export const FIXTURE_CASE_ID = "DXTEST";

const manifest: Manifest = {
  id: FIXTURE_CASE_ID,
  version: "1.0.0",
  title: "Test Fixture Case",
  difficulty: "Beginner",
  estimatedTime: 30,
  author: "Test Suite",
  language: ["en"],
  cover: "assets/covers/cover.webp",
  packageVersion: "1.0",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

const caseInfo: Case = {
  id: FIXTURE_CASE_ID,
  title: { ar: "قضية اختبار", en: "Test Fixture Case" },
  description: { ar: "وصف تجريبي.", en: "A minimal fixture case for automated tests." },
  category: "Theft",
  difficulty: "Beginner",
  estimatedMinutes: 30,
};

const victim: Victim = {
  id: "victim_test",
  name: "Test Victim",
  age: 40,
  occupation: "Clerk",
  causeOfDeath: "N/A",
  timeOfDeath: "N/A",
  location: "Test Location",
  photo: "assets/victim/victim.webp",
};

const suspects: Suspect[] = [
  {
    id: "suspect_001",
    name: "Test Suspect A",
    age: 30,
    occupation: "Neighbor",
    relationship: "Acquaintance",
    motive: "Unknown",
    photo: "assets/suspects/001.webp",
  },
];

const witnesses: Witness[] = [
  {
    id: "witness_001",
    name: "Test Witness A",
    statement: "Saw nothing unusual.",
    reliability: 70,
    photo: "assets/witnesses/001.webp",
  },
];

const evidence: Evidence[] = [
  {
    id: "ev001",
    title: "Test Evidence",
    type: "Fingerprint",
    description: "A test piece of evidence.",
    image: "assets/evidence/001.webp",
    unlockTrigger: "crime_scene_complete",
  },
];

const crimeScene: CrimeScene = {
  id: "scene001",
  name: "Test Scene",
  description: "A minimal test crime scene.",
  images: ["assets/crime_scene/1.webp"],
};

const timeline: TimelineEvent[] = [
  { id: "event001", time: "10:00", title: "Test Event", description: "Something happened." },
];

const documents: DocumentRef[] = [
  { id: "doc001", type: "Police Report", title: "Test Report", file: "assets/documents/report.pdf" },
];

const questions: Question[] = [
  {
    id: "q001",
    type: "multiple_choice",
    question: "Who did it?",
    options: ["Suspect A", "Suspect B"],
    answer: "Suspect A",
  },
];

const solution: Solution = {
  killer: "suspect_001",
  weapon: "Unknown",
  motive: "Unknown",
  perfectScore: 100,
};

const certificate: CertificateConfig = {
  title: "Test Detective",
  template: "gold",
  minimumScore: 60,
};

const achievements: AchievementDef[] = [{ id: "first_case", title: "First Investigation", xp: 100 }];

const ONE_PIXEL_WEBP = Uint8Array.from([
  0x52, 0x49, 0x46, 0x46, 0x1a, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x4c,
  0x0d, 0x00, 0x00, 0x00, 0x2f, 0x00, 0x00, 0x00, 0x10, 0x07, 0x10, 0x11, 0x11, 0x88, 0x88, 0xfe,
  0x07,
]);

export interface FixtureOptions {
  /** Deep-merge overrides applied to the manifest, useful for testing invalid-version/etc. scenarios. */
  manifestOverrides?: Partial<Manifest>;
  /** If true, omits crime_scene.json's referenced image asset to test the "broken asset" rejection path. */
  omitCrimeSceneAsset?: boolean;
  /** If true, corrupts questions.json's JSON so it fails to parse. */
  corruptQuestionsJson?: boolean;
  /** If true, omits solution.json entirely to test the "missing file" rejection path. */
  omitSolutionFile?: boolean;
  /** Overrides the cover asset's raw bytes — used to simulate a reinstall with updated images. */
  coverAssetBytes?: Uint8Array;
}

/** Builds a valid (by default) test .casepack in memory and returns it as a Blob. */
export async function buildFixtureCasepack(options: FixtureOptions = {}): Promise<Blob> {
  const zip = new JSZip();

  zip.file("manifest.json", JSON.stringify({ ...manifest, ...options.manifestOverrides }));
  zip.file("case.json", JSON.stringify(caseInfo));
  zip.file("victim.json", JSON.stringify(victim));
  zip.file("suspects.json", JSON.stringify(suspects));
  zip.file("witnesses.json", JSON.stringify(witnesses));
  zip.file("evidence.json", JSON.stringify(evidence));
  zip.file("crime_scene.json", JSON.stringify(crimeScene));
  zip.file("timeline.json", JSON.stringify(timeline));
  zip.file("documents.json", JSON.stringify(documents));

  if (options.corruptQuestionsJson) {
    zip.file("questions.json", "{ this is not valid JSON");
  } else {
    zip.file("questions.json", JSON.stringify(questions));
  }

  if (!options.omitSolutionFile) {
    zip.file("solution.json", JSON.stringify(solution));
  }

  zip.file("certificate.json", JSON.stringify(certificate));
  zip.file("achievements.json", JSON.stringify(achievements));
  zip.file("localization.json", JSON.stringify({ note: "no documented shape yet" }));
  zip.file("assets.json", JSON.stringify({ note: "no documented shape yet" }));
  zip.file("license.json", JSON.stringify({ publisher: "Test Suite", packageVersion: "1.0.0" }));

  zip.file("assets/covers/cover.webp", options.coverAssetBytes ?? ONE_PIXEL_WEBP);
  zip.file("assets/victim/victim.webp", ONE_PIXEL_WEBP);
  zip.file("assets/suspects/001.webp", ONE_PIXEL_WEBP);
  zip.file("assets/witnesses/001.webp", ONE_PIXEL_WEBP);
  zip.file("assets/evidence/001.webp", ONE_PIXEL_WEBP);
  if (!options.omitCrimeSceneAsset) {
    zip.file("assets/crime_scene/1.webp", ONE_PIXEL_WEBP);
  }
  zip.file("assets/documents/report.pdf", ONE_PIXEL_WEBP);

  const arrayBuffer = await zip.generateAsync({ type: "arraybuffer" });
  return new Blob([arrayBuffer]);
}
