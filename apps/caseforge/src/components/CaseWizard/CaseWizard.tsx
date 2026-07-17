"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button, Stepper } from "@dossier-x/ui";
import { useLocale } from "@dossier-x/i18n";
import { wizardSteps } from "../../lib/wizardSteps";
import { emptyGeneralInformation, type GeneralInformationFields } from "../../lib/generalInformation";
import { GeneralInformationStep } from "./GeneralInformationStep";
import { PendingSchemaStep } from "./PendingSchemaStep";

export function CaseWizard() {
  const router = useRouter();
  const { t } = useLocale();
  const [currentStepId, setCurrentStepId] = React.useState(wizardSteps[0]!.id);
  const [generalInfo, setGeneralInfo] = React.useState<GeneralInformationFields>(
    emptyGeneralInformation,
  );

  const currentIndex = wizardSteps.findIndex((s) => s.id === currentStepId);
  const currentStep = wizardSteps[currentIndex]!;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === wizardSteps.length - 1;

  const goTo = (index: number) => {
    const step = wizardSteps[index];
    if (step) setCurrentStepId(step.id);
  };

  const steppedLabels = wizardSteps.map((s) => ({ id: s.id, label: t(s.labelKey) }));

  return (
    <div className="px-8 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading font-bold uppercase tracking-wide text-text-primary">
            {t("studio.createCase")}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Step {currentIndex + 1} of {wizardSteps.length}: {t(currentStep.labelKey)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/cases")}
          aria-label="Close wizard"
          className="text-text-secondary transition-colors hover:text-text-primary"
        >
          <X size={22} />
        </button>
      </div>

      <div className="mb-10">
        <Stepper steps={steppedLabels} currentStepId={currentStepId} onStepClick={setCurrentStepId} />
      </div>

      <div className="rounded-card border border-border bg-bg-secondary p-6">
        {currentStep.documented ? (
          <GeneralInformationStep value={generalInfo} onChange={setGeneralInfo} />
        ) : (
          <PendingSchemaStep stepLabel={t(currentStep.labelKey)} />
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="secondary" icon={<ChevronLeft size={16} />} onClick={() => goTo(currentIndex - 1)} disabled={isFirst}>
          Previous
        </Button>
        <Button
          variant="primary"
          icon={<ChevronRight size={16} />}
          iconPosition="end"
          onClick={() => goTo(currentIndex + 1)}
          disabled={isLast}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
