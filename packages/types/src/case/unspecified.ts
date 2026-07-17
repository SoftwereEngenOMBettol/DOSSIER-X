import { z } from "zod";

/**
 * localization.json, assets.json, and license.json are each described only
 * in prose in CASE_SCHEMA.md ("ties text to supported languages", "an
 * index of every file under assets/", "license info like package version,
 * publisher, maybe a license key") — none of the three come with a
 * concrete JSON example the way every other file in the package does.
 *
 * Building a strict field-level schema for any of them right now would
 * mean inventing a shape that was never actually specified. Instead, all
 * three are validated only as "parses as a JSON object" — present,
 * well-formed, and read/round-tripped, but not deeply typed. Tighten these
 * once their concrete shape is documented.
 */
export const UnspecifiedJsonObjectSchema = z.record(z.unknown());
export type UnspecifiedJsonObject = z.infer<typeof UnspecifiedJsonObjectSchema>;

export const LocalizationFileSchema = UnspecifiedJsonObjectSchema;
export const AssetsIndexFileSchema = UnspecifiedJsonObjectSchema;
export const LicenseFileSchema = UnspecifiedJsonObjectSchema;
