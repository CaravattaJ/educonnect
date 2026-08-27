import { ConnexionForm } from "@/components/features/auth/connexion-form";

export default function ConnexionPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-2xl font-bold text-brand-700">Connexion</h1>
      <ConnexionForm googleEnabled={googleEnabled} />
    </main>
  );
}
