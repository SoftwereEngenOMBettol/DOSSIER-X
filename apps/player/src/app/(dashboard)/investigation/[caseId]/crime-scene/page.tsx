"use client";

import * as React from "react";
import { useCase } from "../../../../../components/CaseProvider";
import { InvestigationHeader } from "../../../../../components/InvestigationHeader";
import { AssetImage } from "../../../../../components/AssetImage";

export default function CrimeScenePage() {
  const { bundle } = useCase();
  const [activeImage, setActiveImage] = React.useState(bundle.crimeScene.images[0] ?? "");

  return (
    <>
      <InvestigationHeader title="Crime Scene" />
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AssetImage
              assetPath={activeImage}
              alt={bundle.crimeScene.name}
              className="h-96 w-full rounded-card"
            />
            {bundle.crimeScene.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {bundle.crimeScene.images.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`overflow-hidden rounded-image border ${
                      img === activeImage ? "border-gold" : "border-border"
                    }`}
                  >
                    <AssetImage assetPath={img} alt="" className="h-16 w-24" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-card border border-border bg-bg-secondary p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-gold">{bundle.crimeScene.name}</p>
            <p className="mt-3 text-text-secondary">{bundle.crimeScene.description}</p>

            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs uppercase tracking-wide text-text-secondary">Victim</p>
              <p className="mt-1 font-semibold text-text-primary">{bundle.victim.name}</p>
              <p className="text-sm text-text-secondary">
                {bundle.victim.age} · {bundle.victim.occupation}
              </p>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Cause of Death</dt>
                  <dd className="text-text-primary">{bundle.victim.causeOfDeath}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Time of Death</dt>
                  <dd className="text-text-primary">{bundle.victim.timeOfDeath}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Location</dt>
                  <dd className="text-text-primary">{bundle.victim.location}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
