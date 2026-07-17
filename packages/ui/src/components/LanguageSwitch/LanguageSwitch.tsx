"use client";

import { cn } from "../../utils/cn";

export type Locale = "ar" | "en";

export interface LanguageSwitchProps {
  value: Locale;
  onChange: (locale: Locale) => void;
  className?: string;
}

/**
 * Instant language switch — no page reload, no confirmation dialog.
 * Toggling this should flip <html dir> between rtl/ltr immediately
 * (handled by the i18n provider that owns `value`/`onChange`).
 */
export function LanguageSwitch({ value, onChange, className }: LanguageSwitchProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn("inline-flex overflow-hidden rounded-button border border-border", className)}
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === "ar"}
        onClick={() => onChange("ar")}
        className={cn(
          "px-3 py-1.5 text-sm transition-colors duration-fast",
          value === "ar" ? "bg-gold text-bg-primary" : "bg-transparent text-text-secondary hover:text-text-primary",
        )}
      >
        العربية
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === "en"}
        onClick={() => onChange("en")}
        className={cn(
          "px-3 py-1.5 text-sm transition-colors duration-fast",
          value === "en" ? "bg-gold text-bg-primary" : "bg-transparent text-text-secondary hover:text-text-primary",
        )}
      >
        English
      </button>
    </div>
  );
}
