import type { Question, QuestionAnswerRecord, CaseBundle } from "@dossier-x/types";

export interface GradeResult {
  correctCount: number;
  totalCount: number;
  /** 0-100, rounded to the nearest whole number. */
  scorePercent: number;
  /** Per-question breakdown, useful for a review screen. */
  results: Array<{ questionId: string; correct: boolean; selectedOption: string | null; correctAnswer: string | undefined }>;
}

/**
 * Grades a player's recorded answers against a case's questions.json.
 *
 * Note on where the answer key lives: questions.json ships the correct
 * `answer` alongside each question, inside the same .casepack the player
 * already has full offline access to — there is no server to keep an
 * answer key secret from, per this project's no-backend architecture.
 * This mirrors how physical mystery-box games (the answer envelope is in
 * the same box) handle the same constraint. Grading here is the
 * client-side equivalent of "opening the envelope," not a security
 * boundary — the actual protection is simply that the UI never surfaces
 * `question.answer` anywhere before the player submits.
 */
export function gradeQuestions(questions: Question[], answers: QuestionAnswerRecord[]): GradeResult {
  const answerByQuestionId = new Map(answers.map((a) => [a.questionId, a.selectedOption]));

  const results = questions.map((q) => {
    const selectedOption = answerByQuestionId.get(q.id) ?? null;
    const correct = selectedOption !== null && q.answer !== undefined && selectedOption === q.answer;
    return { questionId: q.id, correct, selectedOption, correctAnswer: q.answer };
  });

  const correctCount = results.filter((r) => r.correct).length;
  const totalCount = questions.length;
  const scorePercent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);

  return { correctCount, totalCount, scorePercent, results };
}

export function meetsPassingScore(scorePercent: number, bundle: Pick<CaseBundle, "certificate">): boolean {
  return scorePercent >= bundle.certificate.minimumScore;
}

/** e.g. caseId="DX001", date=2026-08-26 -> "DX001-08262026", matching the reference certificate format. */
export function generateCertificateNumber(caseId: string, date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${caseId}-${mm}${dd}${yyyy}`;
}

export function computeTimeTakenSeconds(startedAt: string | null, now: Date = new Date()): number {
  if (!startedAt) return 0;
  const started = new Date(startedAt).getTime();
  const elapsed = Math.max(0, now.getTime() - started);
  return Math.round(elapsed / 1000);
}
