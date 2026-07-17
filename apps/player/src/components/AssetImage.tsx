"use client";

import { ImageOff } from "lucide-react";
import { cn } from "@dossier-x/ui";
import { useAssetUrl } from "./useAssetUrl";

export interface AssetImageProps {
  assetPath: string | undefined;
  alt: string;
  className?: string;
}

export function AssetImage({ assetPath, alt, className }: AssetImageProps) {
  const url = useAssetUrl(assetPath);

  if (!url) {
    return (
      <div className={cn("flex items-center justify-center bg-card text-text-secondary", className)}>
        <ImageOff size={24} />
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element -- object: URLs from IndexedDB Blobs aren't compatible with next/image's remote-loader pipeline.
  return <img src={url} alt={alt} className={cn("object-cover", className)} />;
}
