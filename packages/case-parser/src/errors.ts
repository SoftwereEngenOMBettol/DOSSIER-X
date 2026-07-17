export class CasepackValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Invalid .casepack file:\n${issues.map((i) => `  - ${i}`).join("\n")}`);
    this.name = "CasepackValidationError";
    this.issues = issues;
  }
}

export class CasepackReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CasepackReadError";
  }
}
