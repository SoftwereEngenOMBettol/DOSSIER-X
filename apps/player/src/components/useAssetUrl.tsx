"use client";

import * as React from "react";
import { useCase } from "./CaseProvider";

export function useAssetUrl(assetPath: string | undefined): string | null {
  const { resolveAsset } = useCase();
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setUrl(null);
    if (!assetPath) return;

    void resolveAsset(assetPath).then((resolved) => {
      if (!cancelled) setUrl(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [assetPath, resolveAsset]);

  return url;
}
