"use client";

import { LanguageSwitch } from "@dossier-x/ui";
import { useLocale } from "@dossier-x/i18n";

export default function StudioSettingsPage() {
  const { t, locale, setLocale } = useLocale();

  return (
    <div className="px-8 py-6">
      <h1 className="mb-6 text-heading font-bold uppercase tracking-wide text-text-primary">
        {t("studio.settings")}
      </h1>

      <section className="max-w-md rounded-card border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">
          {t("settings.language")}
        </h2>
        <LanguageSwitch value={locale} onChange={setLocale} />
        <p className="mt-3 text-xs text-text-secondary">
          Studio does not yet have a persistence layer of its own, so this resets on reload. A dedicated
          Studio settings store can be added once its storage requirements are documented.
        </p>
      </section>
    </div>
  );
}
