"use client";

import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useState, useTransition } from "react";

import { registerOrganisateur } from "@/server/organisateur/register";

interface CityOption {
  id: string;
  name: string;
}

export function InscriptionForm({ cities }: { cities: CityOption[] }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await registerOrganisateur(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
    });
  };

  if (success) {
    return (
      <div className="rounded-lg border border-brand-600 bg-brand-50 p-6 text-slate-900">
        <p className="font-medium">Merci pour votre inscription !</p>
        <p className="mt-2 text-sm">
          Un email de confirmation vous a été envoyé. Veuillez cliquer sur le lien qu'il contient
          pour vérifier votre adresse, puis vous connecter.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Input isRequired name="email" type="email" label="Email de connexion" />
      <Input
        isRequired
        name="password"
        type="password"
        label="Mot de passe"
        description="12 caractères minimum."
      />

      <Input isRequired name="structureName" label="Nom de la structure" />
      <Textarea isRequired name="structureDescription" label="Description de la structure" />
      <Input
        isRequired
        name="contactEmail"
        type="email"
        label="Email de contact"
        description="Utilisé pour recevoir les demandes de contact (non affiché publiquement)."
      />
      <Input name="website" type="url" label="Site web (optionnel)" />
      <Select isRequired name="cityId" label="Ville">
        {cities.map((city) => (
          <SelectItem key={city.id}>{city.name}</SelectItem>
        ))}
      </Select>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button color="primary" type="submit" isLoading={isPending}>
        Créer mon compte
      </Button>
    </form>
  );
}
