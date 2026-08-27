"use client";

import { Button, Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { decideInscription, type PendingInscription } from "@/server/admin/inscriptions";

export function InscriptionsQueue({ inscriptions }: { inscriptions: PendingInscription[] }) {
  if (inscriptions.length === 0) {
    return <p className="text-slate-600">Aucune inscription en attente pour le moment.</p>;
  }

  return (
    <ul className="flex flex-col gap-6">
      {inscriptions.map(({ user, structure }) => (
        <InscriptionCard key={user.id} userId={user.id} email={user.email} structure={structure} />
      ))}
    </ul>
  );
}

interface StructureInfo {
  name: string;
  description: string;
  contactEmail: string;
  website: string | null;
}

function InscriptionCard({
  userId,
  email,
  structure,
}: {
  userId: string;
  email: string;
  structure: StructureInfo;
}) {
  const router = useRouter();
  const [justification, setJustification] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (decision: "VALIDER" | "REJETER") => {
    setError(null);
    const formData = new FormData();
    formData.set("userId", userId);
    formData.set("decision", decision);
    formData.set("justification", justification);

    startTransition(async () => {
      const result = await decideInscription(formData);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  };

  return (
    <li className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold">{structure.name}</h2>
      <p className="text-sm text-slate-600">{structure.description}</p>
      <dl className="mt-3 space-y-1 text-sm">
        <div>
          <dt className="inline font-medium">Compte : </dt>
          <dd className="inline">{email}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Contact : </dt>
          <dd className="inline">{structure.contactEmail}</dd>
        </div>
        {structure.website ? (
          <div>
            <dt className="inline font-medium">Site web : </dt>
            <dd className="inline">{structure.website}</dd>
          </div>
        ) : null}
      </dl>

      <Textarea
        className="mt-4"
        label="Motif (obligatoire en cas de rejet)"
        value={justification}
        onValueChange={setJustification}
      />

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 flex gap-3">
        <Button color="primary" isLoading={isPending} onPress={() => submit("VALIDER")}>
          Valider
        </Button>
        <Button color="danger" variant="bordered" isLoading={isPending} onPress={() => submit("REJETER")}>
          Rejeter
        </Button>
      </div>
    </li>
  );
}
