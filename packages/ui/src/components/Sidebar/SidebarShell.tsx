"use client";

import * as React from "react";
import { cn } from "../../utils/cn";

export interface SidebarShellProps {
  logo: React.ReactNode;
  profile?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Permanent sidebar shell (320px, fixed, dark charcoal, subtle border).
 * "The sidebar NEVER changes between pages. Only the center content changes."
 *
 * This component only provides structure — it does not know about routes,
 * pages, or case data. Compose it at the app level with real nav items.
 */
export function SidebarShell({ logo, profile, footer, children, className }: SidebarShellProps) {
  return (
    <aside
      className={cn(
        "flex h-screen w-sidebar flex-col border-e border-border bg-sidebar",
        className,
      )}
    >
      <div className="px-6 py-6">{logo}</div>

      {profile && <div className="border-b border-border px-6 pb-6">{profile}</div>}

      <nav className="flex-1 overflow-y-auto px-3 py-4">{children}</nav>

      {footer && <div className="border-t border-border px-6 py-4">{footer}</div>}
    </aside>
  );
}
