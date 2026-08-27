"use server";

import { hashPassword } from "@/lib/auth/password";
import { generateVerificationToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/client";
import { sendEmail } from "@/lib/email/send";
import { emailVerificationTemplate } from "@/lib/email/templates";
import { registerSchema } from "@/lib/validation/organisateur";

export interface RegisterResult {
  success: boolean;
  error?: string;
}

export async function registerOrganisateur(formData: FormData): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    structureName: formData.get("structureName"),
    structureDescription: formData.get("structureDescription"),
    contactEmail: formData.get("contactEmail"),
    website: formData.get("website") ?? "",
    cityId: formData.get("cityId"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { success: false, error: "Un compte existe déjà avec cette adresse email." };
  }

  const passwordHash = await hashPassword(data.password);
  const { token, tokenHash, expiresAt } = generateVerificationToken();

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: "ORGANISATEUR",
        accountStatus: "EN_ATTENTE",
        structure: {
          create: {
            name: data.structureName,
            description: data.structureDescription,
            contactEmail: data.contactEmail,
            website: data.website || null,
            cityId: data.cityId,
          },
        },
      },
    });

    await tx.emailVerificationToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });
  });

  const { subject, text } = emailVerificationTemplate(token);
  await sendEmail({ to: data.email, subject, text });

  return { success: true };
}
