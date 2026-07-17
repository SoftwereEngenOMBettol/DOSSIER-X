"use client";

import { FileText, Printer, Download } from "lucide-react";
import { useCase } from "../../../../../components/CaseProvider";
import { InvestigationHeader } from "../../../../../components/InvestigationHeader";
import { useAssetUrl } from "../../../../../components/useAssetUrl";

function DocumentCard({ id, type, title, file }: { id: string; type: string; title: string; file: string }) {
  const url = useAssetUrl(file);

  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-border bg-paper text-bg-primary shadow-card">
      <div className="flex items-start justify-between gap-3 border-b border-archive-brown/15 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-image bg-archive-brown/10 text-archive-brown">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-archive-brown">
              {id} · {type}
            </p>
            <p className="font-semibold">{title}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 bg-paper-shadow/40 px-5 py-3">
        {url ? (
          <>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-archive-brown hover:text-bg-primary"
            >
              <Printer size={14} /> Open &amp; Print
            </a>
            <a
              href={url}
              download={`${id}-${title}.pdf`}
              className="flex items-center gap-1.5 text-sm font-medium text-archive-brown hover:text-bg-primary"
            >
              <Download size={14} /> Download
            </a>
          </>
        ) : (
          <span className="text-sm text-archive-brown">Loading…</span>
        )}
      </div>
    </div>
  );
}

export default function CaseFilePage() {
  const { bundle } = useCase();

  return (
    <>
      <InvestigationHeader title="Case File" />
      <div className="px-8 py-6">
        <div className="mb-8 rounded-card border border-border bg-bg-secondary p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">{bundle.case.title.en}</p>
          <p className="mt-2 text-text-secondary">{bundle.case.description.en}</p>
          <div className="mt-4 flex gap-6 text-sm text-text-secondary">
            <span>Difficulty: {bundle.case.difficulty}</span>
            <span>Est. {bundle.case.estimatedMinutes} min</span>
            <span>{bundle.case.category}</span>
          </div>
        </div>

        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Documents ({bundle.documents.length})
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bundle.documents.map((doc) => (
            <DocumentCard key={doc.id} id={doc.id} type={doc.type} title={doc.title} file={doc.file} />
          ))}
        </div>
      </div>
    </>
  );
}
