/**
 * Resolves a dot-path (e.g. "sidebar.archive") against a nested string
 * dictionary. Every UI string in the app MUST go through this — never
 * hardcode user-facing text in a component, per PROJECT_RULES.
 */
export type Dictionary = { [key: string]: string | Dictionary };

export function resolvePath(dict: Dictionary, path: string): string {
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: unknown = dict;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return path; // Fallback: surface the missing key instead of throwing,
      // so a missing translation is visible during development rather than
      // crashing the whole page.
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}
