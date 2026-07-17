"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, LanguageSwitch } from "@dossier-x/ui";
import { useLocale } from "@dossier-x/i18n";
import { usePlayerSession } from "../components/PlayerSessionProvider";

export default function SplashPage() {
  const router = useRouter();
  const { t, locale, setLocale } = useLocale();
  const { profile, isLoading, startInvestigation } = usePlayerSession();

  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Returning player: skip the splash screen entirely.
  React.useEffect(() => {
    if (!isLoading && profile) {
      router.replace("/archive");
    }
  }, [isLoading, profile, router]);

  const canSubmit = name.trim().length > 0 && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await startInvestigation({ name: name.trim(), locale });
      router.replace("/archive");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || profile) {
    // Avoid flashing the form for returning players while the redirect resolves.
    return <div className="flex h-screen items-center justify-center bg-bg-primary" />;
  }

  return (
    <main className="flex h-screen items-center justify-center bg-bg-primary px-4">
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="w-full max-w-md rounded-dialog border border-border bg-bg-secondary p-8 shadow-dialog"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-gold">{t("app.name")}</h1>
          <p className="mt-2 text-sm text-text-secondary">{t("app.tagline")}</p>
        </div>

        <label htmlFor="detective-name" className="mb-2 block text-sm text-text-secondary">
          {t("splash.detectiveName")}
        </label>
        <input
          id="detective-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("splash.detectiveNamePlaceholder")}
          className="mb-6 w-full rounded-button border border-border bg-card px-4 py-3 text-text-primary outline-none focus-visible:border-gold"
          autoFocus
          maxLength={40}
        />

        <span className="mb-2 block text-sm text-text-secondary">{t("splash.language")}</span>
        <div className="mb-8">
          <LanguageSwitch value={locale} onChange={setLocale} />
        </div>

        <Button type="submit" variant="primary" disabled={!canSubmit} className="w-full">
          {t("splash.start")}
        </Button>
      </form>
    </main>
  );
}
