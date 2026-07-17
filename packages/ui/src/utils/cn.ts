/**
 * Minimal class-name combiner. Kept dependency-free on purpose for the
 * foundation phase — swap for `clsx` + `tailwind-merge` later if class
 * conflicts start appearing across components.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
