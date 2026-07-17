"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { SidebarShell, SidebarSection, SidebarNavItem } from "@dossier-x/ui";
import { useLocale } from "@dossier-x/i18n";
import { primaryNavItems, secondaryNavItems, settingsNavItem } from "./navConfig";

export interface AppSidebarProps {
  /** The caseId segment of the current URL when inside /investigation/[caseId]/..., else null. */
  currentCaseId: string | null;
}

export function AppSidebar({ currentCaseId }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();

  const renderItem = (item: (typeof primaryNavItems)[number]) => {
    const Icon = item.icon;
    const href = item.href(currentCaseId);
    const disabled = href === null;
    return (
      <SidebarNavItem
        key={item.key}
        icon={<Icon size={18} strokeWidth={1.75} />}
        label={t(item.key)}
        active={href !== null && pathname === href}
        disabled={disabled}
        onClick={disabled ? undefined : () => router.push(href)}
      />
    );
  };

  return (
    <SidebarShell
      logo={
        <div className="select-none">
          <p className="text-lg font-bold uppercase tracking-widest text-gold">{t("app.name")}</p>
          <p className="mt-1 text-xs text-text-secondary">{t("app.tagline")}</p>
        </div>
      }
      footer={
        <button
          type="button"
          onClick={() => router.push("/settings")}
          className="flex w-full items-center gap-2 text-sm text-text-secondary transition-colors hover:text-dark-red"
        >
          <LogOut size={16} />
          {t("sidebar.logOut")}
        </button>
      }
    >
      <SidebarSection>{primaryNavItems.map(renderItem)}</SidebarSection>
      <SidebarSection>{secondaryNavItems.map(renderItem)}</SidebarSection>
      <SidebarSection>{renderItem(settingsNavItem)}</SidebarSection>
    </SidebarShell>
  );
}
