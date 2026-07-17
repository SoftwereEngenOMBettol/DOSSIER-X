"use client";

import * as React from "react";
import { LocaleProvider } from "@dossier-x/i18n";

export function StudioProviders({ children }: { children: React.ReactNode }) {
  return <LocaleProvider initialLocale="en">{children}</LocaleProvider>;
}
