"use client";

import * as React from "react";
import type { PlayerProfile, AppSettings } from "@dossier-x/types";
import {
  getPlayerProfile,
  createPlayerProfile,
  updatePlayerProfile as updatePlayerProfileRecord,
  getSettings,
  updateSettings as updateSettingsRecord,
} from "@dossier-x/storage";

interface PlayerSessionValue {
  profile: PlayerProfile | undefined;
  settings: AppSettings | undefined;
  /** True while the initial IndexedDB read is in flight. */
  isLoading: boolean;
  /** Creates the local profile — called once, from the splash screen. */
  startInvestigation: (input: { name: string; locale: "ar" | "en" }) => Promise<void>;
  updateProfile: (patch: Partial<Omit<PlayerProfile, "id" | "createdAt">>) => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  /** Re-reads profile/settings from IndexedDB (used after import/reset). */
  refresh: () => Promise<void>;
}

const PlayerSessionContext = React.createContext<PlayerSessionValue | null>(null);

export function PlayerSessionProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<PlayerProfile | undefined>(undefined);
  const [settings, setSettings] = React.useState<AppSettings | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [p, s] = await Promise.all([getPlayerProfile(), getSettings()]);
      setProfile(p);
      setSettings(s);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const startInvestigation = React.useCallback(
    async (input: { name: string; locale: "ar" | "en" }) => {
      const created = await createPlayerProfile(input);
      await updateSettingsRecord({ locale: input.locale });
      setProfile(created);
      setSettings((prev) => (prev ? { ...prev, locale: input.locale } : prev));
    },
    [],
  );

  const updateProfile = React.useCallback(
    async (patch: Partial<Omit<PlayerProfile, "id" | "createdAt">>) => {
      const updated = await updatePlayerProfileRecord(patch);
      setProfile(updated);
    },
    [],
  );

  const updateSettings = React.useCallback(async (patch: Partial<AppSettings>) => {
    const updated = await updateSettingsRecord(patch);
    setSettings(updated);
  }, []);

  const value = React.useMemo<PlayerSessionValue>(
    () => ({ profile, settings, isLoading, startInvestigation, updateProfile, updateSettings, refresh: load }),
    [profile, settings, isLoading, startInvestigation, updateProfile, updateSettings, load],
  );

  return <PlayerSessionContext.Provider value={value}>{children}</PlayerSessionContext.Provider>;
}

export function usePlayerSession(): PlayerSessionValue {
  const ctx = React.useContext(PlayerSessionContext);
  if (!ctx) throw new Error("usePlayerSession must be used within a PlayerSessionProvider");
  return ctx;
}
