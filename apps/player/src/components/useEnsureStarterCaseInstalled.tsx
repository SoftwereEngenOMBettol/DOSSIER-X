"use client";

import * as React from "react";
import { getInstalledCase } from "@dossier-x/storage";
import { installCasepack } from "@dossier-x/case-parser";

const STARTER_CASE_ID = "DX001";
const STARTER_CASE_URL = "/starter-case/DX001.casepack";
const VERSION_URL = "/starter-case/version.json";

/**
 * Runs on every app load. Installs the bundled starter case if it isn't
 * present yet, exactly as before — but now ALSO checks a small version
 * marker and reinstalls if the bundled file has been updated since the
 * player's copy was installed. Without this, updating DX001's bundled
 * assets (new art, new documents) would silently never reach anyone who
 * already had it installed: the old "only install if missing" check has
 * no way to distinguish "already installed" from "already installed and
 * now stale." installCasepack() itself already preserves the player's
 * progress on reinstall, so this is safe to run automatically.
 */
export function useEnsureStarterCaseInstalled(): void {
  const hasChecked = React.useRef(false);

  React.useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    void (async () => {
      try {
        const existing = await getInstalledCase(STARTER_CASE_ID);

        if (existing) {
          const versionRes = await fetch(VERSION_URL);
          if (!versionRes.ok) return; // can't check -> leave the existing install alone
          const { version: bundledVersion } = (await versionRes.json()) as { version: string };
          if (bundledVersion === existing.installedVersion) return; // already current
        }

        const response = await fetch(STARTER_CASE_URL);
        if (!response.ok) {
          console.error(`Could not fetch bundled starter case (${response.status})`);
          return;
        }
        const blob = await response.blob();
        await installCasepack(blob);
      } catch (err) {
        console.error("Failed to auto-install/update starter case:", err);
      }
    })();
  }, []);
}
