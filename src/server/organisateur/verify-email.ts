"use server";

import { hashToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/client";

export type VerifyEmailResult = "success" | "invalid" | "expired" | "already-used";

export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  const tokenHash = hashToken(token);
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });

  if (!record) {
    return "invalid";
  }
  if (record.usedAt) {
    return "already-used";
  }
  if (record.expiresAt < new Date()) {
    return "expired";
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return "success";
}
