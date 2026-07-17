import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Stepper, type StepperStep } from "../Stepper";

const steps: StepperStep[] = [
  { id: "general", label: "General Information" },
  { id: "victim", label: "Victim" },
  { id: "evidence", label: "Evidence" },
];

describe("Stepper", () => {
  it("marks the current step with aria-current", () => {
    render(<Stepper steps={steps} currentStepId="victim" />);
    expect(screen.getByRole("button", { name: /Victim/ })).toHaveAttribute("aria-current", "step");
  });

  it("does not mark earlier or later steps as current", () => {
    render(<Stepper steps={steps} currentStepId="victim" />);
    expect(screen.getByRole("button", { name: /General Information/ })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("button", { name: /Evidence/ })).not.toHaveAttribute("aria-current");
  });

  it("calls onStepClick with the clicked step's id", async () => {
    const onStepClick = vi.fn();
    render(<Stepper steps={steps} currentStepId="general" onStepClick={onStepClick} />);
    await userEvent.click(screen.getByRole("button", { name: /Evidence/ }));
    expect(onStepClick).toHaveBeenCalledWith("evidence");
  });

  it("is display-only (buttons disabled) when onStepClick is omitted", () => {
    render(<Stepper steps={steps} currentStepId="general" />);
    expect(screen.getByRole("button", { name: /Victim/ })).toBeDisabled();
  });
});
