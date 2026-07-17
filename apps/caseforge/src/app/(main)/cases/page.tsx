"use client";

import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { Button } from "@dossier-x/ui";
import { useLocale } from "@dossier-x/i18n";

export default function StudioCasesPage() {
  const { t } = useLocale();
  const router = useRouter();

  return (
    <div className="px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-heading font-bold uppercase tracking-wide text-text-primary">
          {t("studio.cases")}
        </h1>
        <Button variant="primary" onClick={() => router.push("/cases/new")}>
          {t("studio.createCase")}
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border py-24 text-center">
        <FolderKanban size={40} className="text-text-secondary" />
        <p className="max-w-md text-text-secondary">{t("studio.casesEmpty")}</p>
      </div>
    </div>
  );
}
