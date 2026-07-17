"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, FileClock, Award } from "lucide-react";
import {
  listAnswersForCase,
  getInstalledCase,
  addCertificate,
  markCaseCompleted,
  listCertificates,
} from "@dossier-x/storage";
import { gradeQuestions, meetsPassingScore, generateCertificateNumber, computeTimeTakenSeconds, type GradeResult } from "@dossier-x/engine";
import type { CertificateRecord } from "@dossier-x/types";
import { useCase } from "../../../../../components/CaseProvider";
import { usePlayerSession } from "../../../../../components/PlayerSessionProvider";
import { InvestigationHeader } from "../../../../../components/InvestigationHeader";

export default function FinalReportPage() {
  const router = useRouter();
  const { bundle, caseId } = useCase();
  const { profile } = usePlayerSession();

  const [isLoading, setIsLoading] = React.useState(true);
  const [answeredCount, setAnsweredCount] = React.useState(0);
  const [existingCertificate, setExistingCertificate] = React.useState<CertificateRecord | null>(null);
  const [result, setResult] = React.useState<GradeResult | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const totalQuestions = bundle.questions.length;

  const load = React.useCallback(async () => {
    setIsLoading(true);
    const [answers, certs] = await Promise.all([listAnswersForCase(caseId), listCertificates()]);
    setAnsweredCount(answers.filter((a) => bundle.questions.some((q) => q.id === a.questionId)).length);
    setExistingCertificate(certs.find((c) => c.caseId === caseId) ?? null);
    setIsLoading(false);
  }, [caseId, bundle.questions]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const answers = await listAnswersForCase(caseId);
      const grade = gradeQuestions(bundle.questions, answers);
      setResult(grade);

      if (meetsPassingScore(grade.scorePercent, bundle)) {
        const installed = await getInstalledCase(caseId);
        const now = new Date();
        const record: Omit<CertificateRecord, "id" | "issuedAt"> = {
          caseId,
          caseTitle: bundle.case.title.en,
          playerName: profile?.name ?? "Detective",
          rank: bundle.certificate.title,
          score: grade.scorePercent,
          timeTakenSeconds: computeTimeTakenSeconds(installed?.startedAt ?? null, now),
          difficulty: bundle.case.difficulty,
          certificateNumber: generateCertificateNumber(caseId, now),
        };
        await addCertificate(record);
        await markCaseCompleted(caseId);
        await load();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <InvestigationHeader title="Final Report" />;

  if (existingCertificate) {
    return (
      <>
        <InvestigationHeader title="Final Report" />
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-24 text-center">
          <Award size={44} className="text-gold" />
          <p className="text-lg font-semibold text-text-primary">Case solved — {existingCertificate.score}%</p>
          <p className="max-w-sm text-sm text-text-secondary">
            You&apos;ve already submitted your final report for this investigation and earned your certificate.
          </p>
          <button
            onClick={() => router.push("/certificates")}
            className="mt-2 rounded-button bg-gold px-5 py-2.5 text-sm font-semibold text-bg-primary hover:opacity-90"
          >
            View Certificate
          </button>
        </div>
      </>
    );
  }

  if (result) {
    const passed = meetsPassingScore(result.scorePercent, bundle);
    return (
      <>
        <InvestigationHeader title="Final Report" />
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-20 text-center">
          {passed ? <CheckCircle2 size={44} className="text-success" /> : <XCircle size={44} className="text-dark-red" />}
          <p className="text-lg font-semibold text-text-primary">
            {passed ? "Case solved" : "Not quite — case unsolved"} — {result.scorePercent}%
          </p>
          <p className="max-w-sm text-sm text-text-secondary">
            {passed
              ? "Your certificate has been issued."
              : `You need at least ${bundle.certificate.minimumScore}% to earn a certificate. Review the evidence and update your answers, then submit again — you can retry as many times as you'd like.`}
          </p>
          {passed ? (
            <button
              onClick={() => router.push("/certificates")}
              className="mt-2 rounded-button bg-gold px-5 py-2.5 text-sm font-semibold text-bg-primary hover:opacity-90"
            >
              View Certificate
            </button>
          ) : (
            <button
              onClick={() => router.push(`/investigation/${caseId}/questions`)}
              className="mt-2 rounded-button border border-gold px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10"
            >
              Review My Answers
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <InvestigationHeader title="Final Report" />
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-24 text-center">
        <FileClock size={40} className="text-text-secondary" />
        <p className="text-text-primary">
          {answeredCount} of {totalQuestions} questions answered
        </p>
        <p className="mx-auto max-w-md text-sm text-text-secondary">
          {allAnswered
            ? "Once you submit, your answers are final for this attempt — review them on the Questions page first if you're not sure."
            : "Answer every question on the Questions page before submitting your final report."}
        </p>
        <button
          onClick={() => void handleSubmit()}
          disabled={!allAnswered || isSubmitting}
          className="mt-2 rounded-button bg-gold px-5 py-2.5 text-sm font-semibold text-bg-primary hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? "Submitting…" : "Submit Final Report"}
        </button>
      </div>
    </>
  );
}
