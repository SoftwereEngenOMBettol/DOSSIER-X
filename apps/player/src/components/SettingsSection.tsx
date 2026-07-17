import * as React from "react";

export function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-border bg-bg-secondary p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">{title}</h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}
