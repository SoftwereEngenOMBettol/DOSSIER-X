"use client";

import { useLocale } from "@dossier-x/i18n";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-bg-secondary p-6">
      <p className="text-2xl font-bold text-gold">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </div>
  );
}

export default function StudioDashboardPage() {
  const { t } = useLocale();

  return (
    <div className="px-8 py-6">
      <h1 className="mb-6 text-heading font-bold uppercase tracking-wide text-text-primary">
        {t("studio.dashboard")}
      </h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t("studio.totalCases")} value="0" />
        <StatCard label={t("studio.lastEdit")} value="—" />
        <StatCard label={t("studio.totalExports")} value="0" />
        <StatCard label={t("studio.lastExport")} value="—" />
      </div>
    </div>
  );
}
