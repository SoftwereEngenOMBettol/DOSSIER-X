"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import {
  type GeneralInformationFields,
  DIFFICULTY_OPTIONS,
  CRIME_TYPE_OPTIONS,
} from "../../lib/generalInformation";

export interface GeneralInformationStepProps {
  value: GeneralInformationFields;
  onChange: (value: GeneralInformationFields) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-text-secondary">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-button border border-border bg-card px-4 py-2.5 text-text-primary outline-none focus-visible:border-gold";

export function GeneralInformationStep({ value, onChange }: GeneralInformationStepProps) {
  const set = <K extends keyof GeneralInformationFields>(key: K, val: GeneralInformationFields[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Case Title (English)">
        <input
          className={inputClass}
          value={value.titleEn}
          onChange={(e) => set("titleEn", e.target.value)}
          placeholder="Room 308"
        />
      </Field>

      <Field label="Case Title (Arabic)">
        <input
          className={inputClass}
          dir="rtl"
          value={value.titleAr}
          onChange={(e) => set("titleAr", e.target.value)}
          placeholder="الغرفة 308"
        />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea
            className={inputClass}
            rows={3}
            value={value.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="A hotel guest is found dead in a locked room..."
          />
        </Field>
      </div>

      <Field label="Cover Image">
        <label
          className={`${inputClass} flex cursor-pointer items-center justify-between text-text-secondary`}
        >
          <span className="truncate">{value.coverFileName ?? "Choose an image..."}</span>
          <Upload size={16} className="shrink-0" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => set("coverFileName", e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </Field>

      <Field label="Version">
        <input
          className={inputClass}
          value={value.version}
          onChange={(e) => set("version", e.target.value)}
          placeholder="1.0.0"
        />
      </Field>

      <Field label="Difficulty">
        <select
          className={inputClass}
          value={value.difficulty}
          onChange={(e) => set("difficulty", e.target.value as GeneralInformationFields["difficulty"])}
        >
          {DIFFICULTY_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Estimated Time (minutes)">
        <input
          type="number"
          min={1}
          className={inputClass}
          value={value.estimatedTimeMinutes}
          onChange={(e) => set("estimatedTimeMinutes", Number(e.target.value))}
        />
      </Field>

      <Field label="Crime Type">
        <select
          className={inputClass}
          value={value.crimeType}
          onChange={(e) => set("crimeType", e.target.value as GeneralInformationFields["crimeType"])}
        >
          {CRIME_TYPE_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Keywords (comma-separated)">
        <input
          className={inputClass}
          value={value.keywords}
          onChange={(e) => set("keywords", e.target.value)}
          placeholder="hotel, locked-room, betrayal"
        />
      </Field>
    </div>
  );
}
