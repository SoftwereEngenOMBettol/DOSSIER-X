"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * A labeled ON/OFF switch. Matches the Settings screen's gameplay toggles
 * (Autosave, Hints, Confirm Before Exit, Show Completed Tags).
 */
export function Toggle({ checked, onChange, label, description, disabled = false, id }: ToggleProps) {
  const switchId = id ?? React.useId();

  return (
    <div className="flex items-center justify-between gap-4">
      {(label ?? description) && (
        <div>
          {label && (
            <label htmlFor={switchId} className="block text-sm text-text-primary">
              {label}
            </label>
          )}
          {description && <p className="mt-0.5 text-xs text-text-secondary">{description}</p>}
        </div>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-fast",
          checked ? "bg-gold" : "bg-card",
          disabled && "cursor-not-allowed opacity-40",
        )}
      >
        <motion.span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-bg-primary"
          animate={{ x: checked ? 22 : 2 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </button>
    </div>
  );
}
