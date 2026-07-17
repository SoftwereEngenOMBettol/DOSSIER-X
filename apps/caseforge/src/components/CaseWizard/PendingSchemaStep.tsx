import { FileQuestion } from "lucide-react";

export function PendingSchemaStep({ stepLabel }: { stepLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <FileQuestion size={36} className="text-text-secondary" />
      <div>
        <p className="text-text-primary">{stepLabel} is waiting on CASE_SCHEMA.md</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          This step&apos;s field-level data model isn&apos;t documented yet, so it isn&apos;t built —
          building it now would mean guessing at a schema the project rules explicitly say not to
          invent.
        </p>
      </div>
    </div>
  );
}
