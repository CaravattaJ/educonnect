import { z } from "zod";

// Mot de passe : longueur minimale raisonnable plutôt que des règles de complexité
// artificielles (recommandation NIST, cf. docs/07-securite.md §3).
const passwordSchema = z.string().min(12, "Le mot de passe doit contenir au moins 12 caractères.");

export const registerSchema = z.object({
  email: z.string().email("Adresse email invalide."),
  password: passwordSchema,
  structureName: z.string().min(1, "Le nom de la structure est requis."),
  structureDescription: z.string().min(1, "La description est requise."),
  contactEmail: z.string().email("Adresse email de contact invalide."),
  website: z.string().url("URL invalide.").optional().or(z.literal("")),
  cityId: z.string().uuid("Ville invalide."),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis."),
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'actuel.",
    path: ["newPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Motif obligatoire uniquement en cas de rejet (cf. docs/04-ux.md §3.5).
export const adminDecisionSchema = z
  .object({
    userId: z.string().uuid(),
    decision: z.enum(["VALIDER", "REJETER"]),
    justification: z.string().optional(),
  })
  .refine((data) => data.decision !== "REJETER" || Boolean(data.justification?.trim()), {
    message: "Une justification est requise en cas de rejet.",
    path: ["justification"],
  });
export type AdminDecisionInput = z.infer<typeof adminDecisionSchema>;
