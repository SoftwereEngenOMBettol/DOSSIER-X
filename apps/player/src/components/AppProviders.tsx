"use client";

import * as React from "react";
import { LocaleProvider, useLocale } from "@dossier-x/i18n";
import { PlayerSessionProvider, usePlayerSession } from "./PlayerSessionProvider";

/**
 * Once the player's saved settings load from IndexedDB, push their saved
 * locale into the LocaleProvider. Runs once per settings load; subsequent
 * locale changes flow the other direction (LanguageSwitch -> setLocale ->
 * onLocaleChange -> updateSettings), so this only needs to react to the
 * *initial* load, not fight with user-driven changes afterward.
 */
function LocaleSyncFromSettings({ children }: { children: React.ReactNode }) {
  const { settings, isLoading } = usePlayerSession();
  const { setLocale, locale } = useLocale();
  const hasSynced = React.useRef(false);

  React.useEffect(() => {
    if (isLoading || hasSynced.current || !settings) return;
    hasSynced.current = true;
    if (settings.locale !== locale) {
      setLocale(settings.locale);
    }
  }, [isLoading, settings, locale, setLocale]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PlayerSessionProvider>
      <LocaleProviderBridge>
        <LocaleSyncFromSettings>{children}</LocaleSyncFromSettings>
      </LocaleProviderBridge>
    </PlayerSessionProvider>
  );
}

/** Wires LocaleProvider's onLocaleChange back into IndexedDB via the session context. */
function LocaleProviderBridge({ children }: { children: React.ReactNode }) {
  const { updateSettings } = usePlayerSession();
  return (
    <LocaleProvider initialLocale="en" onLocaleChange={(locale) => void updateSettings({ locale })}>
      {children}
    </LocaleProvider>
  );
}
