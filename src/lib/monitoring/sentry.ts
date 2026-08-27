import * as Sentry from "@sentry/nextjs";

// Intégration Sentry conditionnelle (D24) : si le DSN est absent (ex. développement local
// sans compte Sentry réel, cf. plan d'implémentation d'E0), l'appel est un no-op silencieux —
// jamais une erreur au démarrage. NEXT_PUBLIC_SENTRY_DSN est utilisé côté navigateur (seules
// les variables préfixées NEXT_PUBLIC_ sont incluses dans le bundle client par Next.js) ;
// SENTRY_DSN est utilisé côté serveur/edge.
export function initSentry(): void {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN;
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}
