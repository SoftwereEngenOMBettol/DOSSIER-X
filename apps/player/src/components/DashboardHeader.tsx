"use client";

import * as React from "react";
import { ChevronDown, UserRound } from "lucide-react";
import { usePlayerSession } from "./PlayerSessionProvider";

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { profile } = usePlayerSession();

  return (
    <header className="flex items-center justify-between border-b border-border px-8 py-5">
      <div>
        <h1 className="text-heading font-bold uppercase tracking-wide text-text-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
      </div>

      {profile && (
        <div className="flex items-center gap-3">
          <div className="text-end">
            <p className="text-sm font-semibold text-text-primary">{profile.name}</p>
            <p className="text-xs text-gold">{profile.rank}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-text-secondary">
            <UserRound size={20} />
          </div>
          <ChevronDown size={16} className="text-text-secondary" aria-hidden="true" />
        </div>
      )}
    </header>
  );
}
