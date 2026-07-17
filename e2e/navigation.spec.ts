import { test, expect } from "@playwright/test";

/** Creates a fresh profile via the real UI so each test starts from a known, realistic state. */
async function startAsNewDetective(page: import("@playwright/test").Page, name = "Ahmed") {
  await page.goto("/");
  await page.getByLabel("Detective Name").fill(name);
  await page.getByRole("button", { name: "Start Investigation" }).click();
  await expect(page).toHaveURL(/\/archive$/);
}

test.describe("Sidebar navigation", () => {
  test("case-required sections are disabled until a case is open", async ({ page }) => {
    await startAsNewDetective(page);

    const suspectsLink = page.getByRole("button", { name: "Suspects" });
    await expect(suspectsLink).toBeDisabled();
  });

  test("Notebook, Certificates, Achievements, and Settings are reachable without an open case", async ({
    page,
  }) => {
    await startAsNewDetective(page);

    await page.getByRole("button", { name: "My Notebook" }).click();
    await expect(page).toHaveURL(/\/notebook$/);

    await page.getByRole("button", { name: "Certificates" }).click();
    await expect(page).toHaveURL(/\/certificates$/);

    await page.getByRole("button", { name: "Achievements" }).click();
    await expect(page).toHaveURL(/\/achievements$/);

    await page.getByRole("button", { name: "Settings" }).click();
    await expect(page).toHaveURL(/\/settings$/);
  });

  test("Archive shows the honest empty state when no cases are installed", async ({ page }) => {
    await startAsNewDetective(page);
    await expect(
      page.getByText("No cases installed yet. Import a case to begin."),
    ).toBeVisible();
  });
});

test.describe("Settings persistence", () => {
  test("toggling a setting survives a page reload", async ({ page }) => {
    await startAsNewDetective(page);
    await page.getByRole("button", { name: "Settings" }).click();

    const confirmToggle = page.getByRole("switch", { name: "Confirm Before Exit" });
    const wasChecked = (await confirmToggle.getAttribute("aria-checked")) === "true";

    await confirmToggle.click();
    await expect(confirmToggle).toHaveAttribute("aria-checked", String(!wasChecked));

    await page.reload();
    await expect(page.getByRole("switch", { name: "Confirm Before Exit" })).toHaveAttribute(
      "aria-checked",
      String(!wasChecked),
    );
  });
});
