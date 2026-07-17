"use client";

import * as React from "react";
import type { Suspect } from "@dossier-x/types";
import { useCase } from "../../../../../components/CaseProvider";
import { InvestigationHeader } from "../../../../../components/InvestigationHeader";
import { AssetImage } from "../../../../../components/AssetImage";

function SuspectCard({ suspect, selected, onClick }: { suspect: Suspect; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`overflow-hidden rounded-card border text-start transition-colors duration-fast ${
        selected ? "border-gold" : "border-border hover:border-gold/50"
      }`}
    >
      <AssetImage assetPath={suspect.photo} alt={suspect.name} className="h-40 w-full" />
      <div className="bg-card p-3">
        <p className="font-semibold text-text-primary">{suspect.name}</p>
        <p className="text-sm text-text-secondary">
          Age {suspect.age} · {suspect.occupation}
        </p>
      </div>
    </button>
  );
}

function SuspectDetail({ suspect }: { suspect: Suspect }) {
  return (
    <div className="rounded-card border border-border bg-paper text-bg-primary">
      <AssetImage assetPath={suspect.photo} alt={suspect.name} className="h-56 w-full rounded-t-card" />
      <div className="p-5">
        <p className="text-lg font-bold">{suspect.name}</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between border-b border-archive-brown/20 pb-2">
            <dt className="text-archive-brown">Age</dt>
            <dd>{suspect.age}</dd>
          </div>
          <div className="flex justify-between border-b border-archive-brown/20 pb-2">
            <dt className="text-archive-brown">Occupation</dt>
            <dd>{suspect.occupation}</dd>
          </div>
          <div className="flex justify-between border-b border-archive-brown/20 pb-2">
            <dt className="text-archive-brown">Relationship to Victim</dt>
            <dd>{suspect.relationship}</dd>
          </div>
          <div>
            <dt className="mb-1 text-archive-brown">Motive</dt>
            <dd>{suspect.motive}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function SuspectsPage() {
  const { bundle } = useCase();
  const [selectedId, setSelectedId] = React.useState(bundle.suspects[0]?.id ?? null);
  const selected = bundle.suspects.find((s) => s.id === selectedId) ?? null;

  return (
    <>
      <InvestigationHeader title="Suspects" />
      <div className="grid grid-cols-1 gap-6 px-8 py-6 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-2">
          {bundle.suspects.map((suspect) => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              selected={suspect.id === selectedId}
              onClick={() => setSelectedId(suspect.id)}
            />
          ))}
        </div>
        <div>{selected && <SuspectDetail suspect={selected} />}</div>
      </div>
    </>
  );
}
