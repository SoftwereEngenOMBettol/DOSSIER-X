import { defineConfig, devices } from "@playwright/test";

/**
 * DOSSIER X — Player app E2E smoke tests.
 *
 * NOTE: Playwright needs browser binaries (`npx playwright install`)
 * downloaded from a Playwright-operated CDN. Some sandboxed/CI network
 * environments allow-list only npm/pypi/crates/github and block that CDN —
 * if `pnpm test:e2e` fails with a browser-download error rather than a
 * test failure, that's a network policy issue, not a bug in these tests.
 * Run `npx playwright install --with-deps chromium` once on a machine with
 * open network access first.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "pnpm --filter @dossier-x/player dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
