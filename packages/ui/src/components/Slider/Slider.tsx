"use client";

import * as React from "react";
import { cn } from "../../utils/cn";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  disabled?: boolean;
  id?: string;
  /** Formats the value shown next to the label, e.g. "80%". */
  formatValue?: (value: number) => string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
  disabled = false,
  id,
  formatValue = (v) => `${v}%`,
}: SliderProps) {
  const sliderId = id ?? React.useId();

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor={sliderId} className="text-sm text-text-primary">
            {label}
          </label>
          <span className="text-xs text-text-secondary">{formatValue(value)}</span>
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-card accent-gold",
          disabled && "cursor-not-allowed opacity-40",
        )}
      />
    </div>
  );
}
