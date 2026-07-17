"use client";

import * as React from "react";
import type { Evidence } from "@dossier-x/types";
import { cn } from "@dossier-x/ui";
import { useCase } from "../../../../../components/CaseProvider";
import { InvestigationHeader } from "../../../../../components/InvestigationHeader";
import { AssetImage } from "../../../../../components/AssetImage";

function EvidenceCard({
  item,
  selected,
  onClick,
}: {
  item: Evidence;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "overflow-hidden rounded-card border text-start transition-colors duration-fast",
        selected ? "border-gold" : "border-border hover:border-gold/50",
      )}
    >
      <AssetImage assetPath={item.image} alt={item.title} className="h-32 w-full" />
      <div className="bg-card p-3">
        <p className="text-xs uppercase tracking-wide text-text-secondary">{item.id}</p>
        <p className="truncate font-semibold text-text-primary">{item.title}</p>
      </div>
    </button>
  );
}

export default function EvidenceLockerPage() {
  const { bundle } = useCase();
  const [selectedId, setSelectedId] = React.useState(bundle.evidence[0]?.id ?? null);
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);

  const types = React.useMemo(
    () => Array.from(new Set(bundle.evidence.map((e) => e.type))),
    [bundle.evidence],
  );
  const visible = typeFilter ? bundle.evidence.filter((e) => e.type === typeFilter) : bundle.evidence;
  const selected = bundle.evidence.find((e) => e.id === selectedId) ?? null;

  return (
    <>
      <InvestigationHeader title="Evidence Locker" />
      <div className="px-8 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTypeFilter(null)}
            className={cn(
              "rounded-button border px-3 py-1.5 text-sm transition-colors duration-fast",
              typeFilter === null ? "border-gold bg-gold/10 text-gold" : "border-border text-text-secondary",
            )}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                "rounded-button border px-3 py-1.5 text-sm transition-colors duration-fast",
                typeFilter === type ? "border-gold bg-gold/10 text-gold" : "border-border text-text-secondary",
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-2">
            {visible.map((item) => (
              <EvidenceCard
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onClick={() => setSelectedId(item.id)}
              />
            ))}
          </div>

          {selected && (
            <div className="rounded-card border border-border bg-paper text-bg-primary">
              <AssetImage assetPath={selected.image} alt={selected.title} className="h-56 w-full rounded-t-card" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-archive-brown">{selected.id}</p>
                <p className="text-lg font-bold">{selected.title}</p>
                <p className="mt-1 text-sm text-archive-brown">{selected.type}</p>
                <p className="mt-4">{selected.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
