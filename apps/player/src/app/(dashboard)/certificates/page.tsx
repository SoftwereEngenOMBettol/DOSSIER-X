"use client";

import * as React from "react";
import { useLocale } from "@dossier-x/i18n";
import { listCertificates } from "@dossier-x/storage";
import type { CertificateRecord } from "@dossier-x/types";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { useCaseCatalog } from "../../../components/useCaseCatalog";
import { CertificateCard, LockedCertificateCard } from "../../../components/Certificate";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
}

export default function CertificatesPage() {
  const { t } = useLocale();
  const { items: catalog, isLoading: catalogLoading } = useCaseCatalog();
  const [certificates, setCertificates] = React.useState<CertificateRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    void (async () => {
      setIsLoading(true);
      try {
        setCertificates(await listCertificates());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const certByCase = new Map(certificates.map((c) => [c.caseId, c]));
  const visibleEntries = catalog.filter((item) => item.releaseReady || certByCase.has(item.id));

  return (
    <>
      <DashboardHeader title={t("sidebar.certificates")} />

      <div className="px-8 py-6">
        {!isLoading && !catalogLoading && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {visibleEntries.map((item) => {
              const earned = certByCase.get(item.id);
              return earned ? (
                <CertificateCard
                  key={item.id}
                  playerName={earned.playerName}
                  caseTitle={earned.caseTitle}
                  caseId={earned.caseId}
                  difficulty={earned.difficulty}
                  date={formatDate(earned.issuedAt)}
                />
              ) : (
                <LockedCertificateCard key={item.id} caseId={item.id} caseTitle={item.title.en} />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
