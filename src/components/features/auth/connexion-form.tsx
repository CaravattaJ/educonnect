"use client";

import { Button, Input } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  EmailNotVerified: "Veuillez vérifier votre adresse email avant de vous connecter.",
  CredentialsSignin: "Email ou mot de passe incorrect.",
};

export function ConnexionForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setError(ERROR_MESSAGES[result.error] ?? "Une erreur est survenue.");
        return;
      }

      window.location.href = "/tableau-de-bord";
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <form action={handleSubmit} className="flex flex-col gap-4">
        <Input isRequired name="email" type="email" label="Email" />
        <Input isRequired name="password" type="password" label="Mot de passe" />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button color="primary" type="submit" isLoading={isPending}>
          Se connecter
        </Button>
      </form>

      {googleEnabled ? (
        <Button variant="bordered" onPress={() => void signIn("google")}>
          Continuer avec Google
        </Button>
      ) : null}
    </div>
  );
}
