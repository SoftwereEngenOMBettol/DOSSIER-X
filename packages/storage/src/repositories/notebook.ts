import type { NotebookEntry, LocalId } from "@dossier-x/types";
import { getDb } from "../db";

function generateId(): LocalId {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `note-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function listAllNotes(): Promise<NotebookEntry[]> {
  return getDb().notebook.orderBy("updatedAt").reverse().toArray();
}

export async function listNotesForCase(caseId: string): Promise<NotebookEntry[]> {
  return getDb().notebook.where("caseId").equals(caseId).toArray();
}

export async function addNote(input: { caseId: string; text: string }): Promise<NotebookEntry> {
  const now = new Date().toISOString();
  const entry: NotebookEntry = {
    id: generateId(),
    caseId: input.caseId,
    text: input.text,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
  await getDb().notebook.put(entry);
  return entry;
}

export async function updateNote(
  id: LocalId,
  patch: Partial<Pick<NotebookEntry, "text" | "pinned">>,
): Promise<void> {
  const db = getDb();
  const existing = await db.notebook.get(id);
  if (!existing) return;
  await db.notebook.put({ ...existing, ...patch, updatedAt: new Date().toISOString() });
}

export async function deleteNote(id: LocalId): Promise<void> {
  await getDb().notebook.delete(id);
}
