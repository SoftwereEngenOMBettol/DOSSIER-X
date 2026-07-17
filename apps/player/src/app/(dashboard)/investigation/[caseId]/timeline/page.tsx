"use client";

import { Flag } from "lucide-react";
import { useCase } from "../../../../../components/CaseProvider";
import { InvestigationHeader } from "../../../../../components/InvestigationHeader";

export default function TimelinePage() {
  const { bundle } = useCase();

  return (
    <>
      <InvestigationHeader title="Timeline" />
      <div className="px-8 py-6">
        <ol className="relative border-s border-border ps-6">
          {bundle.timeline.map((event) => (
            <li key={event.id} className="mb-8 last:mb-0">
              <span className="absolute -start-[9px] flex h-4 w-4 items-center justify-center rounded-full border border-gold bg-bg-primary">
                <Flag size={9} className="text-gold" />
              </span>
              <p className="text-sm font-semibold text-gold">{event.time}</p>
              <p className="mt-1 font-semibold text-text-primary">{event.title}</p>
              <p className="mt-1 text-sm text-text-secondary">{event.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
