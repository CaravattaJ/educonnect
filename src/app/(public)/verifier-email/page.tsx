import Link from "next/link";

import { verifyEmail } from "@/server/organisateur/verify-email";

const MESSAGES: Record<string, { title: string; body: string }> = {
  success: {
    title: "Email vérifié",
    body: "Votre adresse email a été confirmée. Vous pouvez maintenant vous connecter.",
  },
  invalid: {
    title: "Lien invalide",
    body: "Ce lien de vérification n'est pas valide.",
  },
  expired: {
    title: "Lien expiré",
    body: "Ce lien de vérification a expiré. Veuillez vous inscrire à nouveau ou contacter le support.",
  },
  "already-used": {
    title: "Lien déjà utilisé",
    body: "Cette adresse email a déjà été vérifiée. Vous pouvez vous connecter.",
  },
};

export default async function VerifierEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await verifyEmail(token) : "invalid";
  const message = MESSAGES[result];

  return (
    <main className="mx-auto max-w-md px-6 py-12 text-center">
      <h1 className="mb-2 text-2xl font-bold text-brand-700">{message?.title}</h1>
      <p className="mb-8 text-slate-600">{message?.body}</p>
      <Link href="/connexion" className="text-brand-700 underline">
        Aller à la connexion
      </Link>
    </main>
  );
}
