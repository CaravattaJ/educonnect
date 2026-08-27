import { Button } from "@heroui/react";

// Page d'accueil minimale (épic E0). Ce n'est pas la page d'accueil finale — cf.
// docs/09-backlog.md (E6 Annuaire) et le plan d'implémentation d'E0 : la landing page aboutie
// reste à concevoir séparément avec l'utilisateur.
const THEME_PREVIEW = [
  { label: "Sport", hex: "#F97316" },
  { label: "Écologie", hex: "#16A34A" },
  { label: "Citoyenneté", hex: "#2563EB" },
  { label: "Santé", hex: "#E11D48" },
  { label: "Art et culture", hex: "#A855F7" },
  { label: "Science et technique", hex: "#0891B2" },
  { label: "Avenir", hex: "#CA8A04" },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-brand-700">EduConnect</h1>
        <p className="text-lg text-slate-600">
          L&apos;annuaire des activités pédagogiques et de leurs intervenants.
        </p>
      </div>

      <ul className="flex flex-wrap justify-center gap-2">
        {THEME_PREVIEW.map((theme) => (
          <li
            key={theme.label}
            className="rounded-full border px-3 py-1 text-sm font-medium"
            style={{ borderColor: theme.hex, color: theme.hex }}
          >
            {theme.label}
          </li>
        ))}
      </ul>

      <Button color="primary" radius="full" size="lg">
        Découvrir l&apos;annuaire
      </Button>
    </main>
  );
}
