import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

/**
 * @testing-library/react normally auto-registers `afterEach(cleanup)` when
 * it detects a global `afterEach`. This project runs Vitest with
 * `globals: false` (explicit imports everywhere, no injected test globals),
 * so that auto-detection silently never fires — every test's rendered DOM
 * would otherwise accumulate, unremoved, across the whole file. Registered
 * explicitly here instead of relying on the implicit behavior.
 */
afterEach(() => {
  cleanup();
});
