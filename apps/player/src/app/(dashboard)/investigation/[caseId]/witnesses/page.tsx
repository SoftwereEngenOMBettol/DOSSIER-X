"use client";

import * as React from "react";
import type { Witness } from "@dossier-x/types";
import { useCase } from "../../../../../components/CaseProvider";
import { InvestigationHeader } from "../../../../../components/InvestigationHeader";
import { AssetImage } from "../../../../../components/AssetImage";

function WitnessRow({ witness, selected, onClick }: { witness: Witness; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-card border p-3 text-start transition-colors duration-fast ${
        selected ? "border-gold bg-gold/5" : "border-border hover:bg-bg-secondary"
      }`}
    >
      <AssetImage assetPath={witness.photo} alt={witness.name} className="h-14 w-14 shrink-0 rounded-full" />
      <div className="min-w-0">
        <p className="truncate font-semibold text-text-primary">{witness.name}</p>
        <p className="text-sm text-text-secondary">Reliability {witness.reliability}%</p>
      </div>
    </button>
  );
}

function WitnessDetail({ witness }: { witness: Witness }) {
  return (
    <div className="rounded-card border border-border bg-paper p-5 text-bg-primary">
      <div className="mb-4 flex items-center gap-4">
        <AssetImage assetPath={witness.photo} alt={witness.name} className="h-16 w-16 rounded-full" />
        <div>
          <p className="text-lg font-bold">{witness.name}</p>
          <p className="text-sm text-archive-brown">Reliability {witness.reliability}%</p>
        </div>
      </div>
      <p className="mb-1 text-xs uppercase tracking-wide text-archive-brown">Statement</p>
      <p>{witness.statement}</p>
    </div>
  );
}

export default function WitnessesPage() {
  const { bundle } = useCase();
  const [selectedId, setSelectedId] = React.useState(bundle.witnesses[0]?.id ?? null);
  const selected = bundle.witnesses.find((w) => w.id === selectedId) ?? null;

  return (
    <>
      <InvestigationHeader title="Witnesses" />
      <div className="grid grid-cols-1 gap-6 px-8 py-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          {bundle.witnesses.map((witness) => (
            <WitnessRow
              key={witness.id}
              witness={witness}
              selected={witness.id === selectedId}
              onClick={() => setSelectedId(witness.id)}
            />
          ))}
        </div>
        <div>{selected && <WitnessDetail witness={selected} />}</div>
      </div>
    </>
  );
}
