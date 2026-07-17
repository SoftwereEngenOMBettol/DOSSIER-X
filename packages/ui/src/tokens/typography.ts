/**
 * DOSSIER X — Design Tokens: Typography
 * English: Inter · Arabic: IBM Plex Sans Arabic
 */

export const fontFamily = {
  en: "var(--font-inter), system-ui, sans-serif",
  ar: "var(--font-ibm-plex-arabic), system-ui, sans-serif",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const fontSize = {
  body: "16px",
  small: "14px",
  sidebar: "15px",
  button: "15px",
  heading: "28px",
  headingLarge: "36px",
} as const;

export const headingStyle = {
  transform: "uppercase",
  letterSpacing: "1px",
  fontWeight: fontWeight.bold,
} as const;
