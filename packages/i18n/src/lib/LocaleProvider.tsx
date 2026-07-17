"use client";

import * as React from "react";
import type { Locale } from "@dossier-x/types";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import { resolvePath, type Dictionary } from "./resolvePath";

/**
 * Deliberately implemented as exhaustive switches rather than
 * `Record<Locale, T>` index access: with `noUncheckedIndexedAccess` enabled
 * project-wide, indexed lookups are typed as possibly-undefined even when
 * the key type is a closed union that covers every record key. A switch
 * keeps this file free of non-null assertions while still being exhaustive
 * — TypeScript will flag it at compile time if a new Locale is ever added
 * without updating these two functions.
 */
function getDictionary(locale: Locale): Dictionary {
  switch (locale) {
    case "en":
      return en;
    case "ar":
      return ar;
  }
}

function getDirection(locale: Locale): "ltr" | "rtl" {
  switch (locale) {
    case "en":
      return "ltr";
    case "ar":
      return "rtl";
  }
}

/** @deprecated kept for external callers that referenced the old lookup table directly; prefer getDirection(). */
export const direction: Record<Locale, "ltr" | "rtl"> = { en: "ltr", ar: "rtl" };

interface LocaleContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export interface LocaleProviderProps {
  initialLocale: Locale;
  onLocaleChange?: (locale: Locale) => void;
  children: React.ReactNode;
}

/**
 * Owns the active locale and applies `dir`/`lang` to <html> immediately on
 * change so the switch feels instant, per MASTER_PROMPT ("must switch
 * instantly"). Persisting the choice to IndexedDB is the caller's
 * responsibility via `onLocaleChange`.
 */
export function LocaleProvider({ initialLocale, onLocaleChange, children }: LocaleProviderProps) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  const applyToDocument = React.useCallback((next: Locale) => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = next;
    document.documentElement.dir = getDirection(next);
  }, []);

  React.useEffect(() => {
    applyToDocument(locale);
  }, [locale, applyToDocument]);

  const setLocale = React.useCallback(
    (next: Locale) => {
      setLocaleState(next);
      onLocaleChange?.(next);
    },
    [onLocaleChange],
  );

  const t = React.useCallback((path: string) => resolvePath(getDictionary(locale), path), [locale]);

  const value = React.useMemo<LocaleContextValue>(
    () => ({ locale, dir: getDirection(locale), setLocale, t }),
    [locale, setLocale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
