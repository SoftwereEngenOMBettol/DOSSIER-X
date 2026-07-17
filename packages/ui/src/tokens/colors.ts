/**
 * DOSSIER X — Design Tokens: Color
 *
 * Source of truth: reference screenshots (design/*.png) take precedence over
 * MASTER_PROMPT.md's earlier #121212 palette, per project rule that reference
 * images are the highest design authority. This file matches DESIGN_SYSTEM.md
 * and UI_IMPLEMENTATION_GUIDE.md, which are consistent with the screenshots.
 *
 * DO NOT hardcode these hex values anywhere else in the codebase.
 * Import from here, or use the corresponding CSS variable / Tailwind class.
 */

export const colors = {
  // Backgrounds
  backgroundPrimary: "#111315",
  backgroundSecondary: "#1A1D20",
  sidebar: "#181A1C",
  card: "#24272B",

  // Paper / document surfaces (evidence, notebook, certificates)
  paper: "#ECE5D8",
  paperShadow: "#D5CCBE",

  // Brand / accent
  gold: "#C8A646",
  archiveBrown: "#5D4B39",

  // Semantic
  darkRed: "#8A1E22",
  evidenceRed: "#B22222",
  success: "#2E7D32",
  warning: "#C49000",

  // Text
  textPrimary: "#F5F5F5",
  textSecondary: "#A5A5A5",

  // Borders
  border: "rgba(255,255,255,0.08)",
} as const;

export type ColorToken = keyof typeof colors;
