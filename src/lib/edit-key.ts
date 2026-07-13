import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

export function hashEditKey(editKey: string) {
  return createHash("sha256")
    .update(`${process.env.TOURNAMENT_KEY_PEPPER ?? ""}:${editKey}`)
    .digest("hex");
}

export function editKeyMatches(editKey: string, expectedHash: string) {
  const actual = Buffer.from(hashEditKey(editKey), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
