"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
}

/**
 * A single sidebar navigation row.
 * Active state: gold border/text per reference screenshots.
 * Disabled state: for sections that require an open case (e.g. Case File
 * before any investigation is loaded) — dimmed, non-interactive.
 */
export const SidebarNavItem = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, SidebarNavItemProps>(
  ({ icon, label, active = false, disabled = false, onClick, href }, ref) => {
    const classes = cn(
      "flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sidebar transition-colors duration-fast",
      active
        ? "border border-gold/40 bg-gold/10 text-gold"
        : "border border-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
      disabled && "pointer-events-none opacity-40",
    );

    const content = (
      <motion.span
        className="flex w-full items-center gap-3"
        whileTap={disabled ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </motion.span>
    );

    if (href && !disabled) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          aria-current={active ? "page" : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={classes}
        aria-current={active ? "page" : undefined}
      >
        {content}
      </button>
    );
  },
);

SidebarNavItem.displayName = "SidebarNavItem";
