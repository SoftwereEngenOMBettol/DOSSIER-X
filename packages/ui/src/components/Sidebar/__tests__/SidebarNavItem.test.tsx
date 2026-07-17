import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SidebarNavItem } from "../SidebarNavItem";

describe("SidebarNavItem", () => {
  it("renders as a button and calls onClick when no href is given", async () => {
    const onClick = vi.fn();
    render(<SidebarNavItem icon={<span />} label="Archive" onClick={onClick} />);
    const item = screen.getByRole("button", { name: "Archive" });
    await userEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("marks the active item with aria-current", () => {
    render(<SidebarNavItem icon={<span />} label="Evidence Locker" active onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Evidence Locker" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("disabled items ignore clicks — used for case-required sections with no case open", async () => {
    const onClick = vi.fn();
    render(<SidebarNavItem icon={<span />} label="Suspects" disabled onClick={onClick} />);
    const item = screen.getByRole("button", { name: "Suspects" });
    expect(item).toBeDisabled();
    await userEvent.click(item);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders as a link when href is provided and not disabled", () => {
    render(<SidebarNavItem icon={<span />} label="Settings" href="/settings" />);
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/settings");
  });
});
