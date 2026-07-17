import { test, expect } from "@playwright/test";

test.describe("Splash / onboarding", () => {
  test("shows the DOSSIER X splash screen with name entry and language choice", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "DOSSIER X" })).toBeVisible();
    await expect(page.getByText("Every Detail Tells a Story.")).toBeVisible();
    await expect(page.getByLabel("Detective Name")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Investigation" })).toBeVisible();
  });

  test("the Start Investigation button is disabled until a name is entered", async ({ page }) => {
    await page.goto("/");
    const startButton = page.getByRole("button", { name: "Start Investigation" });
    await expect(startButton).toBeDisabled();

    await page.getByLabel("Detective Name").fill("Ahmed");
    await expect(startButton).toBeEnabled();
  });

  test("entering a name and starting creates a profile and lands on the Archive", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Detective Name").fill("Ahmed");
    await page.getByRole("button", { name: "Start Investigation" }).click();

    await expect(page).toHaveURL(/\/archive$/);
    await expect(page.getByRole("heading", { name: "Case Archive" })).toBeVisible();
    // The detective name now appears in the dashboard header.
    await expect(page.getByText("Ahmed")).toBeVisible();
  });

  test("a returning player skips the splash screen entirely on reload", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Detective Name").fill("Ahmed");
    await page.getByRole("button", { name: "Start Investigation" }).click();
    await expect(page).toHaveURL(/\/archive$/);

    // Simulate closing and reopening the app.
    await page.goto("/");
    await expect(page).toHaveURL(/\/archive$/);
  });

  test("switching language on the splash screen flips text direction to RTL", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: "العربية" }).click();

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByText("كل تفصيل يروي قصة.")).toBeVisible();
  });
});
