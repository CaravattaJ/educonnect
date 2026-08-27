import type { ReactNode } from "react";

import { prisma } from "@/lib/db/client";
import { requireRole } from "@/lib/permissions/session";

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  EN_ATTENTE: {
    title: "Compte en attente de validation",
    body: "Votre inscription est en cours d'examen par notre équipe. Vous recevrez un email dès qu'elle sera validée. Aucun engagement de délai n'est garanti à ce stade.",
  },
  REJETE: {
    title: "Inscription non validée",
    body: "Votre inscription n'a pas été validée. Consultez l'email qui vous a été envoyé pour en connaître le motif.",
  },
  SUSPENDU: {
    title: "Compte suspendu",
    body: "Votre compte a été suspendu par notre équipe. Contactez-nous si vous pensez qu'il s'agit d'une erreur.",
  },
  ANONYMISE: {
    title: "Compte supprimé",
    body: "Ce compte a été supprimé.",
  },
};

export default async function OrganisateurLayout({ children }: { children: ReactNode }) {
  const session = await requireRole("ORGANISATEUR");
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  if (user.accountStatus !== "ACTIF") {
    const message = STATUS_MESSAGES[user.accountStatus];
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-brand-700">{message?.title}</h1>
        <p className="text-slate-600">{message?.body}</p>
      </main>
    );
  }

  return (
    <div>
      <nav className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="font-bold text-brand-700">EduConnect</span>
          <div className="flex gap-4 text-sm">
            <a href="/tableau-de-bord">Tableau de bord</a>
            <a href="/parametres">Paramètres</a>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-4xl px-6 py-8">{children}</div>
    </div>
  );
}
