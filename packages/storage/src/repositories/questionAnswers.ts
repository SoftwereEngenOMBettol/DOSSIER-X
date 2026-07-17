import type { QuestionAnswerRecord } from "@dossier-x/types";
import { getDb } from "../db";

export async function listAnswersForCase(caseId: string): Promise<QuestionAnswerRecord[]> {
  return getDb().questionAnswers.where("caseId").equals(caseId).toArray();
}

export async function recordAnswer(
  caseId: string,
  questionId: string,
  selectedOption: string,
): Promise<void> {
  await getDb().questionAnswers.put({
    caseId,
    questionId,
    selectedOption,
    answeredAt: new Date().toISOString(),
  });
}
