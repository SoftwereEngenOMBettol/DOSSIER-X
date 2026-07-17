import * as React from "react";

export interface SidebarSectionProps {
  label?: string;
  children: React.ReactNode;
}

export function SidebarSection({ label, children }: SidebarSectionProps) {
  return (
    <div className="mb-6">
      {label && (
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-secondary/70">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
