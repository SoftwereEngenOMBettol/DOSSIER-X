import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "../Toggle";

describe("Toggle", () => {
  it("exposes correct ARIA switch semantics", () => {
    render(<Toggle checked={false} onChange={() => {}} label="Autosave Progress" />);
    const toggle = screen.getByRole("switch", { name: "Autosave Progress" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("reflects checked=true in aria-checked", () => {
    render(<Toggle checked onChange={() => {}} label="Confirm Before Exit" />);
    expect(screen.getByRole("switch", { name: "Confirm Before Exit" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("calls onChange with the inverted value when clicked", async () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} label="Show Completed Tags" />);
    await userEvent.click(screen.getByRole("switch", { name: "Show Completed Tags" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not fire onChange when disabled", async () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} label="Hints Availability" disabled />);
    await userEvent.click(screen.getByRole("switch", { name: "Hints Availability" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders the optional description text", () => {
    render(
      <Toggle
        checked
        onChange={() => {}}
        label="Autosave Progress"
        description="Automatically save your progress"
      />,
    );
    expect(screen.getByText("Automatically save your progress")).toBeInTheDocument();
  });
});
