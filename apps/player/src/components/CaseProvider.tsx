"use client";

import * as React from "react";
import type { CaseBundle } from "@dossier-x/types";
import { getCaseContent, resolveCaseAssetUrl, markCaseOpened, getInstalledCase, upsertInstalledCase } from "@dossier-x/storage";

interface CaseContextValue {
  caseId: string;
  bundle: CaseBundle;
  /** Resolves an asset path exactly as it appears in the bundle's JSON (e.g. Suspect.photo) to a usable <img src>. */
  resolveAsset: (assetPath: string) => Promise<string | null>;
}

const CaseContext = React.createContext<CaseContextValue | null>(null);

export type CaseLoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "ready"; value: CaseContextValue };

export function useCaseLoader(caseId: string): CaseLoadState {
  const [state, setState] = React.useState<CaseLoadState>({ status: "loading" });

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      setState({ status: "loading" });
      const bundle = await getCaseContent(caseId);
      if (cancelled) return;

      if (!bundle) {
        setState({ status: "not-found" });
        return;
      }

      // Mark opened + transition owned -> in_progress on first open, per
      // InstalledCaseRecord.status semantics.
      await markCaseOpened(caseId);
      const installed = await getInstalledCase(caseId);
      if (installed && installed.status === "owned") {
        await upsertInstalledCase({ ...installed, status: "in_progress" });
      }

      if (cancelled) return;
      setState({
        status: "ready",
        value: {
          caseId,
          bundle,
          resolveAsset: (assetPath: string) => resolveCaseAssetUrl(caseId, assetPath),
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  return state;
}

export function CaseProvider({ value, children }: { value: CaseContextValue; children: React.ReactNode }) {
  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}

export function useCase(): CaseContextValue {
  const ctx = React.useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used within a CaseProvider (i.e. under /investigation/[caseId])");
  return ctx;
}
