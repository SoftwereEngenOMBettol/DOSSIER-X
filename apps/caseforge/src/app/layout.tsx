import type { Metadata } from "next";
import "@dossier-x/ui/styles.css";
import "./globals.css";
import { StudioProviders } from "../components/StudioProviders";

export const metadata: Metadata = {
  title: "CASEFORGE Studio — DOSSIER X",
  description: "Investigation creation suite for DOSSIER X.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <StudioProviders>{children}</StudioProviders>
      </body>
    </html>
  );
}
