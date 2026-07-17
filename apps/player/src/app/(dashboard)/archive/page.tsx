"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Upload, Lock, Clock, Star, FileText, Users } from "lucide-react";
import { Button, Card } from "@dossier-x/ui";
import { useLocale } from "@dossier-x/i18n";
import { listInstalledCases, getCaseContent, resolveCaseAssetUrl } from "@dossier-x/storage";
import { installCasepack } from "@dossier-x/case-parser";
import type { InstalledCaseRecord, CaseBundle } from "@dossier-x/types";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { useCaseCatalog, type CatalogItem } from "../../../components/useCaseCatalog";
import { PurchaseDialog } from "../../../components/PurchaseDialog";

type InstalledMap = Map<string, { installed: InstalledCaseRecord; bundle: CaseBundle }>;

function OwnedAssetImage({ assetPath, alt, caseId }: { assetPath: string; alt: string; caseId: string }) {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    void resolveCaseAssetUrl(caseId, assetPath).then((r) => !cancelled && setUrl(r));
    return () => {
      cancelled = true;
    };
  }, [assetPath, caseId]);
  return (
    <div className="h-40 w-full bg-card">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element -- object: URL from an IndexedDB Blob.
        <img src={url} alt={alt} className="h-40 w-full object-cover" />
      )}
    </div>
  );
}

const DIFFICULTY_STARS: Record<string, number> = { Beginner: 2, Intermediate: 3, Advanced: 4, Expert: 5 };

function StarRating({ difficulty }: { difficulty: string }) {
  const filled = DIFFICULTY_STARS[difficulty] ?? 3;
  return (
    <span className="inline-flex items-center gap-0.5" title={difficulty}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={11} className={i < filled ? "fill-gold text-gold" : "text-border"} />
      ))}
    </span>
  );
}

function ClassifiedStamp() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="w-[150%] rotate-[-18deg] border-y-2 py-1 text-center"
        style={{ borderColor: "#8B2635" }}
      >
        <p className="text-sm font-black tracking-[0.2em]" style={{ color: "#B23A4E" }}>
          CLASSIFIED \u2014 ACCESS DENIED
        </p>
      </div>
    </div>
  );
}

function OwnedCard({ installed, bundle }: { installed: InstalledCaseRecord; bundle: CaseBundle }) {
  const router = useRouter();
  return (
    <Card
      interactive
      className="overflow-hidden"
      onClick={() => router.push(`/investigation/${installed.caseId}/case-file`)}
    >
      <OwnedAssetImage assetPath={bundle.manifest.cover} alt={bundle.manifest.title} caseId={installed.caseId} />
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-text-secondary">{installed.caseId}</p>
          <span className="text-xs uppercase tracking-wide text-gold">{installed.status.replace("_", " ")}</span>
        </div>
        <p className="font-semibold text-text-primary">{bundle.manifest.title}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-text-secondary">
          <StarRating difficulty={bundle.manifest.difficulty} />
          <span>{bundle.manifest.estimatedTime} min</span>
        </div>
      </div>
    </Card>
  );
}

function LockedCard({ item, onClick }: { item: CatalogItem; onClick: () => void }) {
  const isComingSoon = !item.releaseReady;
  return (
    <Card interactive className="overflow-hidden" onClick={onClick}>
      <div className="relative h-40 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- static public/ asset, not an optimizable remote image */}
        <img src={item.previewCover} alt={item.title.en} className="h-40 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        {!isComingSoon && <ClassifiedStamp />}

        <div
          className={`absolute end-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-md ${
            isComingSoon ? "bg-bg-primary/90 text-text-secondary" : "bg-gold text-bg-primary"
          }`}
        >
          {isComingSoon ? (
            <>
              <Clock size={12} /> Coming Soon
            </>
          ) : (
            <>
              <Lock size={12} /> Locked
            </>
          )}
        </div>

        <p className="absolute bottom-2 start-3 end-3 font-semibold text-white drop-shadow-md">{item.title.en}</p>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-text-secondary">{item.id}</p>
          <StarRating difficulty={item.difficulty} />
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {item.estimatedMinutes} min
          </span>
          {item.stats.evidenceCount !== undefined && (
            <span className="flex items-center gap-1">
              <FileText size={12} /> {item.stats.evidenceCount} evidence
            </span>
          )}
          {item.stats.witnessCount !== undefined && (
            <span className="flex items-center gap-1">
              <Users size={12} /> {item.stats.witnessCount} witnesses
            </span>
          )}
        </div>

        {isComingSoon ? (
          <p className="text-sm text-text-secondary">In production — check back soon.</p>
        ) : (
          <p className="flex items-center gap-1.5 text-sm font-medium text-gold">
            <Lock size={13} /> Purchase to unlock
          </p>
        )}
      </div>
    </Card>
  );
}

export default function ArchivePage() {
  const { t } = useLocale();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { items: catalog, isLoading: catalogLoading } = useCaseCatalog();
  const [installedMap, setInstalledMap] = React.useState<InstalledMap>(new Map());
  const [isLoadingInstalled, setIsLoadingInstalled] = React.useState(true);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [dialogItem, setDialogItem] = React.useState<CatalogItem | null>(null);

  const loadInstalled = React.useCallback(async () => {
    setIsLoadingInstalled(true);
    try {
      const installed = await listInstalledCases();
      const withContent = await Promise.all(
        installed.map(async (rec) => {
          const bundle = await getCaseContent(rec.caseId);
          return bundle ? ([rec.caseId, { installed: rec, bundle }] as const) : null;
        }),
      );
      setInstalledMap(new Map(withContent.filter((e): e is readonly [string, { installed: InstalledCaseRecord; bundle: CaseBundle }] => e !== null)));
    } finally {
      setIsLoadingInstalled(false);
    }
  }, []);

  React.useEffect(() => {
    void loadInstalled();
  }, [loadInstalled]);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setNotice(null);
    try {
      await installCasepack(file);
      await loadInstalled();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Something went wrong while importing this case.");
    }
  };

  const isLoading = catalogLoading || isLoadingInstalled;

  return (
    <>
      <DashboardHeader title={t("archive.title")} subtitle={t("archive.subtitle")} />

      <div className="px-8 py-6">
        <div className="mb-6 flex justify-end">
          <input
            ref={fileInputRef}
            type="file"
            accept=".casepack"
            className="hidden"
            onChange={(e) => void handleFileSelected(e)}
          />
          <Button variant="primary" icon={<Upload size={16} />} onClick={() => fileInputRef.current?.click()}>
            Import Case
          </Button>
        </div>

        {notice && (
          <div className="mb-6 rounded-card border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
            {notice}
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.map((item) => {
              const owned = installedMap.get(item.id);
              return owned ? (
                <OwnedCard key={item.id} installed={owned.installed} bundle={owned.bundle} />
              ) : (
                <LockedCard key={item.id} item={item} onClick={() => setDialogItem(item)} />
              );
            })}
          </div>
        )}
      </div>

      <PurchaseDialog item={dialogItem} onClose={() => setDialogItem(null)} />
    </>
  );
}
