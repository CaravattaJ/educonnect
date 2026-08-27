import { InscriptionForm } from "@/components/features/auth/inscription-form";
import { prisma } from "@/lib/db/client";

export default async function InscriptionPage() {
  const cities = await prisma.city.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold text-brand-700">Créer un compte Organisateur</h1>
      <p className="mb-8 text-slate-600">
        Renseignez les informations de votre structure. Votre inscription sera examinée par
        notre équipe avant activation.
      </p>
      <InscriptionForm cities={cities} />
    </main>
  );
}
