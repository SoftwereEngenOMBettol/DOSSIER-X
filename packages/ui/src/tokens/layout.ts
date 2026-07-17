/**
 * DOSSIER X — Design Tokens: Layout, Radius, Shadow, Motion
 */

export const radius = {
  button: "12px",
  card: "18px",
  dialog: "20px",
  image: "14px",
} as const;

export const shadow = {
  // "Very soft. Never exaggerated. Cards should float slightly."
  card: "0 8px 24px rgba(0,0,0,0.35)",
  cardHover: "0 12px 32px rgba(0,0,0,0.45)",
  dialog: "0 24px 64px rgba(0,0,0,0.55)",
} as const;

export const layout = {
  sidebarWidth: "320px",
  sidebarWidthCompact: "88px",
  contentMaxWidth: "1600px",
} as const;

/**
 * Animation must be slow, elegant, natural — never flashy, never bouncy.
 * Use these durations with Framer Motion `transition={{ duration: motion.X }}`.
 */
export const motion = {
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  easing: [0.22, 1, 0.36, 1] as const, // easeOutExpo-ish, no bounce
} as const;
