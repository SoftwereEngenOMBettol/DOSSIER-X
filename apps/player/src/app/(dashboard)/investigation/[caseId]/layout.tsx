"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { FolderX } from "lucide-react";
import { CaseProvider, useCaseLoader } from "../../../../components/CaseProvider";

function InvestigationGate({ caseId, children }: { caseId: string; children: React.ReactNode }) {
  const state = useCaseLoader(caseId);
  const router = useRouter();

  if (state.status === "loading") {
    return <div className="flex h-full items-center justify-center py-24 text-text-secondary">Loading case…</div>;
  }

  if (state.status === "not-found") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <FolderX size={40} className="text-text-secondary" />
        <p className="text-text-primary">This case isn&apos;t installed.</p>
        <button
          type="button"
          onClick={() => router.push("/archive")}
          className="text-sm text-gold hover:underline"
        >
          Back to Archive
        </button>
      </div>
    );
  }

  return <CaseProvider value={state.value}>{children}</CaseProvider>;
}

export default function InvestigationLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ caseId: string }>();
  return <InvestigationGate caseId={params.caseId}>{children}</InvestigationGate>;
}
