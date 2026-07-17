/** @type {import('tailwindcss').Config} */
module.exports = {
  // Deliberately no `content` array here. Content paths are relative to
  // the consuming app, not to this preset file, so each app's own
  // tailwind.config.js defines its own content globs (which already
  // include both its own src/ and packages/ui/src/). A shared preset
  // hardcoding relative content paths only happens to work if every
  // consuming app sits at the same folder depth — fragile, so this
  // preset only carries theme/plugin config, which genuinely is shared.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        sidebar: "var(--color-sidebar)",
        card: "var(--color-card)",
        paper: "var(--color-paper)",
        "paper-shadow": "var(--color-paper-shadow)",
        gold: "var(--color-gold)",
        "archive-brown": "var(--color-archive-brown)",
        "dark-red": "var(--color-dark-red)",
        "evidence-red": "var(--color-evidence-red)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
      },
      borderRadius: {
        button: "var(--radius-button)",
        card: "var(--radius-card)",
        dialog: "var(--radius-dialog)",
        image: "var(--radius-image)",
      },
      fontFamily: {
        en: ["var(--font-inter)", "system-ui", "sans-serif"],
        ar: ["var(--font-ibm-plex-arabic)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "var(--content-max-width)",
      },
      width: {
        sidebar: "var(--sidebar-width)",
        "sidebar-compact": "var(--sidebar-width-compact)",
      },
      transitionTimingFunction: {
        "dossier-ease": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        fast: "200ms",
        base: "300ms",
        slow: "500ms",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.35)",
        "card-hover": "0 12px 32px rgba(0,0,0,0.45)",
        dialog: "0 24px 64px rgba(0,0,0,0.55)",
      },
    },
  },
  plugins: [],
};
