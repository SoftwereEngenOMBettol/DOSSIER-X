"use client";

import * as React from "react";
import { Download, RotateCcw, Trash2, Upload, Check } from "lucide-react";
import { Button, LanguageSwitch, Toggle, Slider } from "@dossier-x/ui";
import { useLocale } from "@dossier-x/i18n";
import { exportProgress, importProgress, resetAllProgress, resetSettings } from "@dossier-x/storage";
import { usePlayerSession } from "../../../components/PlayerSessionProvider";
import { SettingsSection } from "../../../components/SettingsSection";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { useDebouncedCallback } from "../../../lib/useDebouncedCallback";

export default function SettingsPage() {
  const { t, locale, setLocale } = useLocale();
  const { profile, settings, updateProfile, updateSettings, refresh } = usePlayerSession();

  const importInputRef = React.useRef<HTMLInputElement>(null);
  const [name, setName] = React.useState(profile?.name ?? "");
  const [savedPulse, setSavedPulse] = React.useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile]);

  const debouncedSaveName = useDebouncedCallback((value: string) => {
    if (value.trim().length > 0) void updateProfile({ name: value.trim() });
  }, 500);

  const pulseSaved = () => {
    setSavedPulse(true);
    setTimeout(() => setSavedPulse(false), 1200);
  };

  const handleExport = async () => {
    const bundle = await exportProgress();
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dossier-x-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    try {
      const parsed: unknown = JSON.parse(text);
      await importProgress(parsed);
      await refresh();
      pulseSaved();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Could not import this file.");
    }
  };

  const handleResetProgress = async () => {
    await resetAllProgress();
    setResetConfirmOpen(false);
    window.location.href = "/"; // no profile left — back to splash
  };

  const handleResetSettings = async () => {
    const defaults = await resetSettings();
    setLocale(defaults.locale);
    pulseSaved();
  };

  if (!settings) return null;

  return (
    <>
      <DashboardHeader title={t("settings.title")} subtitle={t("settings.subtitle")} />

      <div className="grid grid-cols-1 gap-6 px-8 py-6 lg:grid-cols-2">
        <SettingsSection title={t("settings.account")}>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-text-secondary">
              {t("settings.detectiveName")}
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                debouncedSaveName(e.target.value);
              }}
              className="w-full rounded-button border border-border bg-card px-4 py-2.5 text-text-primary outline-none focus-visible:border-gold"
              maxLength={40}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">{t("profile.rank")}</span>
            <span className="text-text-primary">{profile?.rank}</span>
          </div>
        </SettingsSection>

        <SettingsSection title={t("settings.language")}>
          <div>
            <span className="mb-2 block text-sm text-text-secondary">{t("splash.language")}</span>
            <LanguageSwitch value={locale} onChange={setLocale} />
          </div>
        </SettingsSection>

        <SettingsSection title={t("settings.appearance")}>
          <div>
            <span className="mb-2 block text-sm text-text-secondary">{t("settings.theme")}</span>
            <div className="inline-flex overflow-hidden rounded-button border border-border">
              <span className="bg-gold px-4 py-1.5 text-sm text-bg-primary">Dark</span>
              <span className="cursor-not-allowed px-4 py-1.5 text-sm text-text-secondary opacity-40">
                Light
              </span>
              <span className="cursor-not-allowed px-4 py-1.5 text-sm text-text-secondary opacity-40">
                Sepia
              </span>
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              Light and Sepia themes are shown in the reference design as future options and are not yet
              implemented.
            </p>
          </div>
        </SettingsSection>

        <SettingsSection title={t("settings.soundMusic")}>
          <Slider
            label={t("settings.masterVolume")}
            value={settings.masterVolume}
            onChange={(v) => void updateSettings({ masterVolume: v })}
          />
          <Slider
            label={t("settings.music")}
            value={settings.musicVolume}
            onChange={(v) => void updateSettings({ musicVolume: v })}
          />
          <Slider
            label={t("settings.soundEffects")}
            value={settings.sfxVolume}
            onChange={(v) => void updateSettings({ sfxVolume: v })}
          />
        </SettingsSection>

        <SettingsSection title={t("settings.gameplay")}>
          <Toggle
            label={t("settings.autosaveProgress")}
            description="Automatically save your progress"
            checked={settings.autosaveEnabled}
            onChange={(v) => void updateSettings({ autosaveEnabled: v })}
          />
          <Toggle
            label={t("settings.confirmBeforeExit")}
            checked={settings.confirmBeforeExit}
            onChange={(v) => void updateSettings({ confirmBeforeExit: v })}
          />
          <Toggle
            label={t("settings.showCompletedTags")}
            checked={settings.showCompletedTags}
            onChange={(v) => void updateSettings({ showCompletedTags: v })}
          />
        </SettingsSection>

        <SettingsSection title={t("settings.dataPrivacy")}>
          <button
            type="button"
            onClick={() => void handleExport()}
            className="flex items-center justify-between text-sm text-text-primary hover:text-gold"
          >
            <span>{t("settings.exportData")}</span>
            <Download size={16} />
          </button>
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="flex items-center justify-between text-sm text-text-primary hover:text-gold"
          >
            <span>{t("settings.importData")}</span>
            <Upload size={16} />
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => void handleImportFile(e)}
          />
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="flex items-center justify-between text-sm text-dark-red hover:brightness-125"
          >
            <span>{t("settings.resetData")}</span>
            <Trash2 size={16} />
          </button>
        </SettingsSection>
      </div>

      <div className="flex items-center justify-between border-t border-border px-8 py-5">
        <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={() => void handleResetSettings()}>
          {t("settings.resetAllSettings")}
        </Button>
        <Button variant="primary" icon={savedPulse ? <Check size={16} /> : undefined} onClick={pulseSaved}>
          {savedPulse ? "Saved" : t("settings.saveChanges")}
        </Button>
      </div>

      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-dialog border border-border bg-bg-secondary p-6">
            <p className="mb-6 text-text-primary">
              This permanently deletes your detective profile, notebook, achievements, and certificates
              from this device. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setResetConfirmOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button variant="danger" onClick={() => void handleResetProgress()}>
                {t("settings.resetData")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
