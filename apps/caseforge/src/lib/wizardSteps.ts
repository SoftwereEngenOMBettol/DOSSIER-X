export interface WizardStepConfig {
  id: string;
  labelKey: string;
  /** True if this step's field-level data model is actually documented and safe to build. */
  documented: boolean;
}

export const wizardSteps: WizardStepConfig[] = [
  { id: "general", labelKey: "studio.wizard.steps.general", documented: true },
  { id: "victim", labelKey: "studio.wizard.steps.victim", documented: false },
  { id: "crimeScene", labelKey: "studio.wizard.steps.crimeScene", documented: false },
  { id: "evidence", labelKey: "studio.wizard.steps.evidence", documented: false },
  { id: "suspects", labelKey: "studio.wizard.steps.suspects", documented: false },
  { id: "witnesses", labelKey: "studio.wizard.steps.witnesses", documented: false },
  { id: "timeline", labelKey: "studio.wizard.steps.timeline", documented: false },
  { id: "documents", labelKey: "studio.wizard.steps.documents", documented: false },
  { id: "questions", labelKey: "studio.wizard.steps.questions", documented: false },
  { id: "solution", labelKey: "studio.wizard.steps.solution", documented: false },
  { id: "preview", labelKey: "studio.wizard.steps.preview", documented: false },
  { id: "export", labelKey: "studio.wizard.steps.export", documented: false },
];
