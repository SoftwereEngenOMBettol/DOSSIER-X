import type { PlayerProfile } from "@dossier-x/types";
import { getDb } from "../db";

/**
 * A DOSSIER X installation has exactly one local player profile.
 * "PROFILE_ID" is a fixed key since there is no multi-account concept
 * (per MASTER_PROMPT: "No Authentication. No User Accounts.").
 */
const PROFILE_ID = "local-player";

export async function getPlayerProfile(): Promise<PlayerProfile | undefined> {
  return getDb().playerProfile.get(PROFILE_ID);
}

export async function createPlayerProfile(
  input: Pick<PlayerProfile, "name" | "locale">,
): Promise<PlayerProfile> {
  const profile: PlayerProfile = {
    id: PROFILE_ID,
    name: input.name,
    locale: input.locale,
    rank: "Junior Detective",
    xp: 0,
    casesSolved: 0,
    createdAt: new Date().toISOString(),
  };
  await getDb().playerProfile.put(profile);
  return profile;
}

export async function updatePlayerProfile(
  patch: Partial<Omit<PlayerProfile, "id" | "createdAt">>,
): Promise<PlayerProfile> {
  const db = getDb();
  const existing = await db.playerProfile.get(PROFILE_ID);
  if (!existing) {
    throw new Error("Cannot update player profile: no profile exists yet.");
  }
  const updated: PlayerProfile = { ...existing, ...patch };
  await db.playerProfile.put(updated);
  return updated;
}
