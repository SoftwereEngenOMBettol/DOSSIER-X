"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { AppSidebar } from "../../components/AppSidebar";
import { usePlayerSession } from "../../components/PlayerSessionProvider";
import { useEnsureStarterCaseInstalled } from "../../components/useEnsureStarterCaseInstalled";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, isLoading } = usePlayerSession();
  // Present only when the current route is under /investigation/[caseId]/...
  // — useParams() reflects the full matched route's params regardless of
  // where in the tree it's called, so this is empty on e.g. /archive.
  const params = useParams<{ caseId?: string }>();
  const currentCaseId = params.caseId ?? null;

  useEnsureStarterCaseInstalled();

  React.useEffect(() => {
    if (!isLoading && !profile) {
      router.replace("/");
    }
  }, [isLoading, profile, router]);

  if (isLoading || !profile) {
    return <div className="h-screen bg-bg-primary" />;
  }

  return (
    <div className="flex h-screen bg-bg-primary">
      <AppSidebar currentCaseId={currentCaseId} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
