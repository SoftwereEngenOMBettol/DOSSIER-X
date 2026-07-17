import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Buy Case</Button>);
    expect(screen.getByRole("button", { name: "Buy Case" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continue Investigation</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Continue Investigation" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Submit Investigation
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Submit Investigation" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders an icon alongside the label", () => {
    render(<Button icon={<span data-testid="icon" />}>Import Case</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies the primary variant class for the gold CTA style", () => {
    render(<Button variant="primary">Start Investigation</Button>);
    expect(screen.getByRole("button", { name: "Start Investigation" })).toHaveClass("bg-gold");
  });

  it("applies the danger variant class for destructive actions", () => {
    render(<Button variant="danger">Reset Progress</Button>);
    expect(screen.getByRole("button", { name: "Reset Progress" })).toHaveClass("bg-dark-red");
  });
});
