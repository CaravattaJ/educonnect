"use server";

import { randomUUID } from "node:crypto";

import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/client";
import { requireRole } from "@/lib/permissions/session";
import { changePasswordSchema } from "@/lib/validation/organisateur";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function changePassword(formData: FormData): Promise<ActionResult> {
  const session = await requireRole("ORGANISATEUR");

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  if (!user.passwordHash) {
    return { success: false, error: "Ce compte n'a pas de mot de passe (connexion via Google)." };
  }

  const currentMatches = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!currentMatches) {
    return { success: false, error: "Mot de passe actuel incorrect." };
  }

  const newPasswordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newPasswordHash } });

  return { success: true };
}

// Suppression de compte par anonymisation (D12, cf. docs/06-modele-donnees.md §4.2).
export async function deleteAccount(): Promise<ActionResult> {
  const session = await requireRole("ORGANISATEUR");

  const anonymizedMarker = `anonymise-${randomUUID()}@educonnect.invalid`;

  await prisma.$transaction(async (tx) => {
    const structure = await tx.structure.findUnique({ where: { userId: session.user.id } });

    await tx.user.update({
      where: { id: session.user.id },
      data: {
        email: anonymizedMarker,
        passwordHash: null,
        googleId: null,
        accountStatus: "ANONYMISE",
        anonymizedAt: new Date(),
      },
    });

    if (structure) {
      await tx.structure.update({
        where: { id: structure.id },
        data: {
          name: "Structure supprimée",
          description: "",
          logoUrl: null,
          website: null,
          contactEmail: anonymizedMarker,
        },
      });

      await tx.activity.updateMany({
        where: { structureId: structure.id, status: { not: "DEPUBLIEE" } },
        data: { status: "DEPUBLIEE" },
      });

      await tx.intervenant.updateMany({
        where: { structureId: structure.id, status: { not: "DESACTIVEE" } },
        data: { status: "DESACTIVEE" },
      });
    }
  });

  return { success: true };
}
