"use client";

import { Button, Input } from "@heroui/react";
import { signOut } from "next-auth/react";
import { useState, useTransition } from "react";

import { changePassword, deleteAccount } from "@/server/organisateur/account";

export function ParametresForm() {
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handlePasswordSubmit = (formData: FormData) => {
    setPasswordError(null);
    setPasswordSuccess(false);
    startPasswordTransition(async () => {
      const result = await changePassword(formData);
      if (result.success) {
        setPasswordSuccess(true);
      } else {
        setPasswordError(result.error ?? "Une erreur est survenue.");
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      await deleteAccount();
      await signOut({ callbackUrl: "/" });
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Changer de mot de passe</h2>
        <form action={handlePasswordSubmit} className="flex flex-col gap-4">
          <Input isRequired name="currentPassword" type="password" label="Mot de passe actuel" />
          <Input isRequired name="newPassword" type="password" label="Nouveau mot de passe" />
          {passwordError ? <p className="text-sm text-red-600">{passwordError}</p> : null}
          {passwordSuccess ? (
            <p className="text-sm text-green-700">Mot de passe mis à jour.</p>
          ) : null}
          <Button color="primary" type="submit" isLoading={isPasswordPending}>
            Enregistrer
          </Button>
        </form>
      </section>

      <section className="border-t pt-8">
        <h2 className="mb-2 text-lg font-semibold text-red-700">Supprimer mon compte</h2>
        <p className="mb-4 text-sm text-slate-600">
          Cette action est irréversible. Vos données personnelles seront anonymisées et vos
          activités dépubliées.
        </p>
        {confirmingDelete ? (
          <div className="flex gap-3">
            <Button color="danger" isLoading={isDeletePending} onPress={handleDelete}>
              Confirmer la suppression
            </Button>
            <Button variant="light" onPress={() => setConfirmingDelete(false)}>
              Annuler
            </Button>
          </div>
        ) : (
          <Button color="danger" variant="bordered" onPress={() => setConfirmingDelete(true)}>
            Supprimer mon compte
          </Button>
        )}
      </section>
    </div>
  );
}
