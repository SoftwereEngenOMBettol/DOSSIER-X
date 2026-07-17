"use client";

import { useCase } from "./CaseProvider";
import { DashboardHeader } from "./DashboardHeader";

export function InvestigationHeader({ title }: { title: string }) {
  const { bundle } = useCase();
  return <DashboardHeader title={title} subtitle={`${bundle.manifest.id} – ${bundle.case.title.en}`} />;
}
