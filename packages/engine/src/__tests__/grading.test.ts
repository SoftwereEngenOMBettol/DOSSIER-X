import { describe, it, expect } from "vitest";
import type { Question, QuestionAnswerRecord } from "@dossier-x/types";
import { gradeQuestions, meetsPassingScore, generateCertificateNumber, computeTimeTakenSeconds } from "../grading";

const questions: Question[] = [
  { id: "q1", type: "multiple_choice", question: "Who did it?", options: ["A", "B"], answer: "B" },
  { id: "q2", type: "multiple_choice", question: "What weapon?", options: ["Knife", "Rope"], answer: "Knife" },
  { id: "q3", type: "multiple_choice", question: "Where?", options: ["Kitchen", "Garden"], answer: "Kitchen" },
  { id: "q4", type: "multiple_choice", question: "When?", options: ["Morning", "Night"], answer: "Night" },
];

describe("gradeQuestions", () => {
  it("scores 100% when every answer matches", () => {
    const answers: QuestionAnswerRecord[] = questions.map((q) => ({
      caseId: "DX001",
      questionId: q.id,
      selectedOption: q.answer!,
      answeredAt: "2026-01-01T00:00:00.000Z",
    }));
    const result = gradeQuestions(questions, answers);
    expect(result.correctCount).toBe(4);
    expect(result.totalCount).toBe(4);
    expect(result.scorePercent).toBe(100);
  });

  it("scores partial credit correctly, rounded to nearest whole percent", () => {
    const answers: QuestionAnswerRecord[] = [
      { caseId: "DX001", questionId: "q1", selectedOption: "B", answeredAt: "t" }, // correct
      { caseId: "DX001", questionId: "q2", selectedOption: "Rope", answeredAt: "t" }, // wrong
      { caseId: "DX001", questionId: "q3", selectedOption: "Kitchen", answeredAt: "t" }, // correct
      { caseId: "DX001", questionId: "q4", selectedOption: "Morning", answeredAt: "t" }, // wrong
    ];
    const result = gradeQuestions(questions, answers);
    expect(result.correctCount).toBe(2);
    expect(result.scorePercent).toBe(50);
  });

  it("treats an unanswered question as incorrect rather than throwing", () => {
    const answers: QuestionAnswerRecord[] = [
      { caseId: "DX001", questionId: "q1", selectedOption: "B", answeredAt: "t" },
      // q2, q3, q4 never answered
    ];
    const result = gradeQuestions(questions, answers);
    expect(result.correctCount).toBe(1);
    expect(result.totalCount).toBe(4);
    expect(result.scorePercent).toBe(25);
    const q2Result = result.results.find((r) => r.questionId === "q2");
    expect(q2Result?.correct).toBe(false);
    expect(q2Result?.selectedOption).toBeNull();
  });

  it("never awards credit for a stale answer to a question id that no longer exists", () => {
    const answers: QuestionAnswerRecord[] = [
      { caseId: "DX001", questionId: "q1", selectedOption: "B", answeredAt: "t" },
      { caseId: "DX001", questionId: "q_removed_in_a_later_version", selectedOption: "whatever", answeredAt: "t" },
    ];
    const result = gradeQuestions(questions, answers);
    // Only the 4 real questions count, regardless of extra stored answers.
    expect(result.totalCount).toBe(4);
    expect(result.correctCount).toBe(1);
  });

  it("returns 0% for zero questions rather than dividing by zero", () => {
    const result = gradeQuestions([], []);
    expect(result.scorePercent).toBe(0);
    expect(result.totalCount).toBe(0);
  });
});

describe("meetsPassingScore", () => {
  it("passes at or above the threshold, fails below it", () => {
    const bundle = { certificate: { title: "x", template: "gold", minimumScore: 70 } };
    expect(meetsPassingScore(70, bundle)).toBe(true);
    expect(meetsPassingScore(100, bundle)).toBe(true);
    expect(meetsPassingScore(69, bundle)).toBe(false);
  });
});

describe("generateCertificateNumber", () => {
  it("formats as caseId-MMDDYYYY, matching the reference design", () => {
    const date = new Date(2026, 7, 26); // August 26, 2026 (JS months are 0-indexed)
    expect(generateCertificateNumber("DX001", date)).toBe("DX001-08262026");
  });

  it("pads single-digit months and days", () => {
    const date = new Date(2026, 0, 5); // January 5, 2026
    expect(generateCertificateNumber("DX002", date)).toBe("DX002-01052026");
  });
});

describe("computeTimeTakenSeconds", () => {
  it("computes elapsed seconds between startedAt and now", () => {
    const started = new Date("2026-01-01T10:00:00.000Z");
    const now = new Date("2026-01-01T11:58:42.000Z"); // 1h58m42s later
    expect(computeTimeTakenSeconds(started.toISOString(), now)).toBe(7122); // 1*3600 + 58*60 + 42
  });

  it("returns 0 when startedAt is null rather than throwing", () => {
    expect(computeTimeTakenSeconds(null)).toBe(0);
  });

  it("never returns a negative duration even with clock skew", () => {
    const started = new Date("2026-01-01T12:00:00.000Z");
    const now = new Date("2026-01-01T11:00:00.000Z"); // now is somehow before started
    expect(computeTimeTakenSeconds(started.toISOString(), now)).toBe(0);
  });
});
