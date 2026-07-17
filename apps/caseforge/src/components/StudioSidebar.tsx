"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, Settings } from "lucide-react";
import { SidebarShell, SidebarSection, SidebarNavItem } from "@dossier-x/ui";
import { useLocale } from "@dossier-x/i18n";

const items = [
  { href: "/dashboard", key: "studio.dashboard", icon: LayoutDashboard, disabled: false },
  { href: "/cases", key: "studio.cases", icon: FolderKanban, disabled: false },
  { href: "/settings", key: "studio.settings", icon: Settings, disabled: false },
];

export function StudioSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();

  return (
    <SidebarShell
      logo={
        <div className="select-none">
          <p className="text-lg font-bold uppercase tracking-widest text-gold">{t("studio.name")}</p>
          <p className="mt-1 text-xs text-text-secondary">{t("studio.tagline")}</p>
        </div>
      }
    >
      <SidebarSection>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarNavItem
              key={item.href}
              icon={<Icon size={18} strokeWidth={1.75} />}
              label={t(item.key)}
              active={pathname === item.href}
              onClick={() => router.push(item.href)}
            />
          );
        })}
      </SidebarSection>
    </SidebarShell>
  );
}
