"use client";

import { Lock, FileText, Users, UserRound, Trophy, ExternalLink } from "lucide-react";
import { Dialog, Button } from "@dossier-x/ui";
import type { CatalogItem } from "./useCaseCatalog";

export interface PurchaseDialogProps {
  item: CatalogItem | null;
  onClose: () => void;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | undefined }) {
  if (value === undefined) return null;
  return (
    <div className="flex items-center gap-2 text-text-secondary">
      <span className="text-gold">{icon}</span>
      <span>
        {value} {label}
      </span>
    </div>
  );
}

export function PurchaseDialog({ item, onClose }: PurchaseDialogProps) {
  if (!item) return null;

  const hasStats = Object.keys(item.stats).length > 0;

  return (
    <Dialog open={!!item} onClose={onClose} title={item.title.en}>
      <p className="mb-4 text-text-secondary">{item.tagline?.en}</p>

      <div className="mb-5 grid grid-cols-2 gap-3 rounded-card border border-border bg-bg-primary p-4 text-sm">
        <div className="text-text-secondary">
          Difficulty: <span className="text-text-primary">{item.difficulty}</span>
        </div>
        <div className="text-text-secondary">
          Est. Time: <span className="text-text-primary">{item.estimatedMinutes} min</span>
        </div>
        {hasStats ? (
          <>
            <Stat icon={<FileText size={14} />} label="Evidence" value={item.stats.evidenceCount} />
            <Stat icon={<FileText size={14} />} label="Documents" value={item.stats.documentCount} />
            <Stat icon={<Users size={14} />} label="Witnesses" value={item.stats.witnessCount} />
            <Stat icon={<UserRound size={14} />} label="Suspects" value={item.stats.suspectCount} />
            <Stat icon={<Trophy size={14} />} label="Achievements" value={item.stats.achievementCount} />
          </>
        ) : (
          <div className="col-span-2 text-text-secondary">Full details available at release.</div>
        )}
      </div>

      {item.certificateTitle && (
        <p className="mb-5 text-sm text-text-secondary">
          Certificate on completion: <span className="text-gold">{item.certificateTitle}</span>
        </p>
      )}

      {item.releaseReady ? (
        item.purchaseUrl ? (
          <Button
            variant="primary"
            className="w-full"
            icon={<ExternalLink size={16} />}
            onClick={() => window.open(item.purchaseUrl!, "_blank", "noopener,noreferrer")}
          >
            Buy Investigation
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-button border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
            <Lock size={16} /> Purchase link not configured yet.
          </div>
        )
      ) : (
        <div className="flex items-center gap-2 rounded-button border border-border bg-bg-primary px-4 py-3 text-sm text-text-secondary">
          <Lock size={16} /> This investigation is still in production.
        </div>
      )}
    </Dialog>
  );
}
