"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { recordAnswer, listAnswersForCase } from "@dossier-x/storage";
import { cn } from "@dossier-x/ui";
import { useCase } from "../../../../../components/CaseProvider";
import { InvestigationHeader } from "../../../../../components/InvestigationHeader";

export default function QuestionsPage() {
  const { bundle, caseId } = useCase();
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    void (async () => {
      const saved = await listAnswersForCase(caseId);
      setAnswers(Object.fromEntries(saved.map((a) => [a.questionId, a.selectedOption])));
      setIsLoading(false);
    })();
  }, [caseId]);

  const selectAnswer = async (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    await recordAnswer(caseId, questionId, option);
  };

  return (
    <>
      <InvestigationHeader title="Questions" />
      <div className="px-8 py-6">
        <div className="mb-6 rounded-card border border-border bg-bg-secondary px-4 py-3 text-sm text-text-secondary">
          Your answers are saved as you go. Submit your Final Report once you&apos;ve answered everything to see
          your score.
        </div>

        {!isLoading && (
          <div className="flex flex-col gap-6">
            {bundle.questions.map((q, index) => (
              <div key={q.id} className="rounded-card border border-border bg-bg-secondary p-6">
                <p className="mb-4 text-text-primary">
                  <span className="me-2 text-text-secondary">Q{index + 1}.</span>
                  {q.question}
                </p>
                {q.options && (
                  <div className="flex flex-col gap-2">
                    {q.options.map((option) => {
                      const isSelected = answers[q.id] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => void selectAnswer(q.id, option)}
                          className={cn(
                            "flex items-center justify-between rounded-button border px-4 py-2.5 text-start transition-colors duration-fast",
                            isSelected
                              ? "border-gold bg-gold/10 text-gold"
                              : "border-border text-text-primary hover:bg-card",
                          )}
                        >
                          {option}
                          {isSelected && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
