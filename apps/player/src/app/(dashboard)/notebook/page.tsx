"use client";

import * as React from "react";
import { NotebookPen, Pin, PinOff, Trash2 } from "lucide-react";
import { useLocale } from "@dossier-x/i18n";
import { listAllNotes, updateNote, deleteNote } from "@dossier-x/storage";
import type { NotebookEntry } from "@dossier-x/types";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function NotebookPage() {
  const { t } = useLocale();
  const [notes, setNotes] = React.useState<NotebookEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      setNotes(await listAllNotes());
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const togglePin = async (note: NotebookEntry) => {
    await updateNote(note.id, { pinned: !note.pinned });
    await load();
  };

  const remove = async (note: NotebookEntry) => {
    await deleteNote(note.id);
    await load();
  };

  return (
    <>
      <DashboardHeader title={t("sidebar.notebook")} />

      <div className="px-8 py-6">
        {!isLoading && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border py-24 text-center">
            <NotebookPen size={40} className="text-text-secondary" />
            <p className="max-w-sm text-text-secondary">
              Notes you take while investigating a case will appear here, across every case you own.
            </p>
          </div>
        )}

        {notes.length > 0 && (
          <ul className="flex flex-col gap-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex items-start justify-between gap-4 rounded-card border border-border bg-paper px-5 py-4 text-bg-primary"
              >
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-archive-brown">{note.caseId}</p>
                  <p>{note.text}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => void togglePin(note)}
                    aria-label={note.pinned ? "Unpin note" : "Pin note"}
                    className="text-archive-brown hover:text-gold"
                  >
                    {note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(note)}
                    aria-label="Delete note"
                    className="text-archive-brown hover:text-dark-red"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
