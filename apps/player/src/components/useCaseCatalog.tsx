"use client";

import * as React from "react";
import { CaseCatalogSchema, type CaseCatalogEntry } from "@dossier-x/types";

export interface CatalogItem extends CaseCatalogEntry {
  purchaseUrl: string | null;
}

interface CatalogState {
  items: CatalogItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches /case-catalog.json (storefront listing, all 7 cases) and
 * /store-config.json (editable Gumroad links) at runtime rather than
 * bundling them as imports — so updating a purchase URL is a matter of
 * editing a static file, not touching TypeScript source.
 */
export function useCaseCatalog(): CatalogState {
  const [state, setState] = React.useState<CatalogState>({ items: [], isLoading: true, error: null });

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [catalogRes, storeRes] = await Promise.all([
          fetch("/case-catalog.json"),
          fetch("/store-config.json"),
        ]);

        if (!catalogRes.ok) throw new Error(`Failed to load case catalog (${catalogRes.status})`);
        const rawCatalog: unknown = await catalogRes.json();
        const parseResult = CaseCatalogSchema.safeParse(rawCatalog);
        if (!parseResult.success) {
          throw new Error(
            `case-catalog.json failed validation: ${parseResult.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; ")}`,
          );
        }
        const catalog: CaseCatalogEntry[] = parseResult.data;

        // Store config is treated as optional/best-effort — a missing or
        // broken store-config.json shouldn't take down the whole Archive,
        // it just means purchase links won't resolve yet.
        let purchaseUrls: Record<string, string> = {};
        if (storeRes.ok) {
          const storeConfig = (await storeRes.json()) as { purchaseUrls?: Record<string, string> };
          purchaseUrls = storeConfig.purchaseUrls ?? {};
        }

        if (cancelled) return;
        setState({
          items: catalog.map((entry) => ({ ...entry, purchaseUrl: purchaseUrls[entry.id] ?? null })),
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setState({ items: [], isLoading: false, error: err instanceof Error ? err.message : String(err) });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
