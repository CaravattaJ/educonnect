// Hook Next.js exécuté une fois au démarrage du serveur (Node.js et Edge).
// Cf. src/lib/monitoring/sentry.ts pour le comportement conditionnel (D24).
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    const { initSentry } = await import("@/lib/monitoring/sentry");
    initSentry();
  }
}
