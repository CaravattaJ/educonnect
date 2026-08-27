// Registre de communication : vouvoiement, institutionnel et chaleureux (D20).

function appUrl(): string {
  return process.env.APP_URL ?? "http://localhost:3000";
}

export function emailVerificationTemplate(token: string): { subject: string; text: string } {
  const link = `${appUrl()}/verifier-email?token=${token}`;
  return {
    subject: "Confirmez votre adresse email — EduConnect",
    text: [
      "Bonjour,",
      "",
      "Merci de vous être inscrit·e sur EduConnect. Pour confirmer votre adresse email, veuillez cliquer sur le lien ci-dessous :",
      "",
      link,
      "",
      "Ce lien est valable 24 heures. Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.",
      "",
      "L'équipe EduConnect",
    ].join("\n"),
  };
}

export function inscriptionValideeTemplate(structureName: string): { subject: string; text: string } {
  return {
    subject: "Votre compte EduConnect a été validé",
    text: [
      `Bonjour,`,
      "",
      `Votre compte pour "${structureName}" a été validé par notre équipe. Vous pouvez désormais publier vos activités sur EduConnect.`,
      "",
      `Connectez-vous : ${appUrl()}/connexion`,
      "",
      "L'équipe EduConnect",
    ].join("\n"),
  };
}

export function inscriptionRejeteeTemplate(
  structureName: string,
  reason: string,
): { subject: string; text: string } {
  return {
    subject: "Votre inscription EduConnect n'a pas pu être validée",
    text: [
      `Bonjour,`,
      "",
      `Votre inscription pour "${structureName}" n'a pas pu être validée pour la raison suivante :`,
      "",
      reason,
      "",
      "Vous pouvez corriger votre profil et le soumettre à nouveau depuis votre espace.",
      "",
      "L'équipe EduConnect",
    ].join("\n"),
  };
}
