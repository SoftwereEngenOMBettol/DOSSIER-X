import type { Metadata } from "next";
import "@dossier-x/ui/styles.css";
import "./globals.css";
import { AppProviders } from "../components/AppProviders";

export const metadata: Metadata = {
  title: "DOSSIER X",
  description: "Every Detail Tells a Story.",
};

/**
 * NOTE on fonts: DESIGN_SYSTEM.md specifies Inter (EN) and IBM Plex Sans
 * Arabic (AR). This environment has no network access to Google Fonts at
 * build time, so we fall back to the system-ui stack via CSS variables
 * (see packages/ui/src/styles/globals.css). Once the real font files are
 * available, load them with `next/font/local` and point --font-inter /
 * --font-ibm-plex-arabic at them — no other code needs to change.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
