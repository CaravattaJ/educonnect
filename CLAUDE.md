# EduConnect — Contexte pour le développement assisté

Ce projet suit une méthode de cadrage en phases documentées avant tout développement — voir `docs/00-process.md`. Les Phases 1 à 9 (cadrage produit, spécifications, MVP, UX, architecture, modèle de données, sécurité, organisation du dépôt, backlog) sont **validées**. Le développement (Phase 10) suit désormais le backlog défini dans `docs/09-backlog.md`, épic par épic.

## Modèle produit (important, pivot du 2026-08-27)

EduConnect est un **annuaire d'activités pédagogiques**, pas un annuaire d'intervenants. Un **Organisateur** (seul rôle "métier", avec l'**Admin**) publie ses propres **activités**, en déclarant pour chacune au moins un **Intervenant** — une fiche de référence sans compte ni connexion, créée et réutilisable par l'Organisateur, modérée par l'admin. Une activité ne peut être publiée que si tous ses Intervenants sont validés. Le contact se fait par un formulaire simple vers l'Organisateur (pas de messagerie interne au MVP). Voir `docs/DECISIONS.md` D-042 à D-046 pour le détail.

## Règle d'or

**Ne jamais étendre ou modifier le périmètre fonctionnel sans revenir amender le document de phase concerné dans `docs/` et sans consigner la décision dans `docs/DECISIONS.md`.** Si une implémentation révèle qu'une décision antérieure doit changer, s'arrêter et amender la documentation avant de continuer le code (cf. précédent : l'amendement de la Phase 3 lors de la Phase 6, qui a retiré la messagerie interne du MVP).

## Documents de référence à lire avant de coder une fonctionnalité

- `docs/DECISIONS.md` — journal de toutes les décisions validées (D1 à D41 à ce jour), source de vérité rapide.
- `docs/03-mvp.md` — périmètre exact du MVP (inclus / explicitement reporté), avec son amendement.
- `docs/06-modele-donnees.md` — entités, champs, relations, diagrammes d'état à respecter dans le schéma Prisma.
- `docs/07-securite.md` — exigences non négociables (RBAC, RGPD, anti-spam, limite de responsabilité D33 à afficher dans l'UI).
- `docs/09-backlog.md` — épics et user stories, avec critères d'acceptation, dans l'ordre à suivre (E0 → E11).

## Stack (Phase 5 et 8)

- TypeScript, Next.js (App Router), Tailwind CSS, HeroUI (thème personnalisé à définir en E0).
- PostgreSQL + Prisma.
- Auth.js (email/mot de passe + Google OAuth).
- Resend (email transactionnel), Sentry (monitoring), stockage S3-compatible (logos).
- pnpm, ESLint/Prettier renforcés, tests dans `tests/unit/` et `tests/e2e/` (Playwright), CI GitHub Actions.

## Conventions

- Branches : une branche par tâche depuis `main`, PR obligatoire, CI verte requise pour fusionner.
- Commits : Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Definition of Done (D41) : PR fusionnée avec CI verte + tests du critère d'acceptation + revue humaine si zone sensible (auth, permissions, futur paiement) + doc à jour si amendement.
- Migrations Prisma versionnées uniquement — jamais de modification manuelle du schéma en base.

## État actuel

Aucun code applicatif n'existe encore. Prochaine étape : épic **E0 — Fondations techniques** (`docs/09-backlog.md` §3), à démarrer sur confirmation explicite de l'utilisateur.
