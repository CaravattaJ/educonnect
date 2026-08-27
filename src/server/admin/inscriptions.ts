"use server";

import type { Structure, User } from "@prisma/client";

import { prisma } from "@/lib/db/client";
import { sendEmail } from "@/lib/email/send";
import { inscriptionRejeteeTemplate, inscriptionValideeTemplate } from "@/lib/email/templates";
import { requireRole } from "@/lib/permissions/session";
import { adminDecisionSchema } from "@/lib/validation/organisateur";

export interface PendingInscription {
  user: User;
  structure: Structure;
}

export async function listPendingInscriptions(): Promise<PendingInscription[]> {
  await requireRole("ADMIN");

  const users = await prisma.user.findMany({
    where: { role: "ORGANISATEUR", accountStatus: "EN_ATTENTE" },
    include: { structure: true },
    orderBy: { createdAt: "asc" },
  });

  return users
    .filter((user): user is User & { structure: Structure } => user.structure !== null)
    .map((user) => ({ user, structure: user.structure }));
}

export interface DecisionResult {
  success: boolean;
  error?: string;
}

const DEFAULT_VALIDATION_JUSTIFICATION = "Inscription validée : informations conformes.";

function resolveJustification(decision: "VALIDER" | "REJETER", justification?: string): string {
  const trimmed = justification?.trim();
  if (decision === "VALIDER") {
    return trimmed || DEFAULT_VALIDATION_JUSTIFICATION;
  }
  // Toujours renseigné à ce stade : le schéma (adminDecisionSchema) impose une justification
  // non vide pour un rejet.
  return trimmed as string;
}

async function notifyDecision(
  decision: "VALIDER" | "REJETER",
  target: { email: string; structure: Structure | null },
  justification: string,
): Promise<void> {
  const structureName = target.structure?.name ?? "votre structure";
  const { subject, text } =
    decision === "VALIDER"
      ? inscriptionValideeTemplate(structureName)
      : inscriptionRejeteeTemplate(structureName, justification);
  await sendEmail({ to: target.email, subject, text });
}

export async function decideInscription(formData: FormData): Promise<DecisionResult> {
  const admin = await requireRole("ADMIN");

  const parsed = adminDecisionSchema.safeParse({
    userId: formData.get("userId"),
    decision: formData.get("decision"),
    justification: formData.get("justification") ?? undefined,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const { userId, decision, justification } = parsed.data;

  const target = await prisma.user.findUnique({ where: { id: userId }, include: { structure: true } });
  if (!target || target.role !== "ORGANISATEUR" || target.accountStatus !== "EN_ATTENTE") {
    return { success: false, error: "Cette inscription n'est plus en attente de validation." };
  }

  const finalJustification = resolveJustification(decision, justification);
  const isValidation = decision === "VALIDER";

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: isValidation
        ? { accountStatus: "ACTIF", rejectionReason: null }
        : { accountStatus: "REJETE", rejectionReason: finalJustification },
    }),
    prisma.adminAction.create({
      data: {
        adminUserId: admin.user.id,
        actionType: isValidation ? "VALIDATION_INSCRIPTION" : "REJET_INSCRIPTION",
        targetType: "USER",
        targetId: userId,
        justification: finalJustification,
      },
    }),
  ]);

  await notifyDecision(decision, target, finalJustification);

  return { success: true };
}
