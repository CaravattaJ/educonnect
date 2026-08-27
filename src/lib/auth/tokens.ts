import { createHash, randomBytes } from "node:crypto";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h (cf. templates.ts)

export function generateVerificationToken(): { token: string; tokenHash: string; expiresAt: Date } {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
