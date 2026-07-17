"use client";

import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

export interface StepperStep {
  id: string;
  label: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStepId: string;
  /** Called when a step's number/label is clicked. Omit to make the stepper display-only. */
  onStepClick?: (stepId: string) => void;
  className?: string;
}

/**
 * Horizontal numbered step indicator. A step is "complete" if it appears
 * before the current step in the array — this component has no opinion on
 * validation; the caller decides what counts as reachable.
 */
export function Stepper({ steps, currentStepId, onStepClick, className }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <ol className={cn("flex w-full items-center", className)} aria-label="Progress">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = step.id === currentStepId;
        const isLast = index === steps.length - 1;

        return (
          <li key={step.id} className={cn("flex items-center", !isLast && "flex-1")}>
            <button
              type="button"
              onClick={() => onStepClick?.(step.id)}
              disabled={!onStepClick}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1.5 text-center",
                onStepClick && "cursor-pointer",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-fast",
                  isCurrent && "border-gold bg-gold text-bg-primary",
                  isComplete && !isCurrent && "border-gold bg-gold/10 text-gold",
                  !isCurrent && !isComplete && "border-border bg-card text-text-secondary",
                )}
              >
                {isComplete ? <Check size={14} /> : index + 1}
              </span>
              <span
                className={cn(
                  "max-w-[80px] text-[11px] leading-tight",
                  isCurrent ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {step.label}
              </span>
            </button>
            {!isLast && (
              <span
                className={cn(
                  "mx-2 h-px flex-1 transition-colors duration-fast",
                  isComplete ? "bg-gold" : "bg-border",
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
