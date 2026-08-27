# EduConnect — Contexte pour le développement assisté

## Modèle produit courant

EduConnect est un annuaire d'offres d'activités pédagogiques. **Le prestataire proposant l'intervention publie ses offres et reçoit les demandes associées** (D-047, confirmation explicite du 2026-08-27). Ce n'est pas un recueil d'activités passées publiées par les établissements qui les ont accueillies.

- Prestataire : structure fournissant l'activité ; un profil peut porter plusieurs offres.
- Structure demandeuse : établissement scolaire, ACM, médiathèque, association, collectivité, etc. Elle consulte et contacte sans compte dans le MVP.
- Administrateur : validation des comptes, modération et taxonomie.
- Le besoin est considéré établi pour avancer ; aucune enquête préalable n'est un jalon bloquant (D-048).
- La vocation commerciale est distincte du pilote gratuit conservé par D-002. Aucun tarif, quota payant ni paiement n'est validé.

## Statut documentaire et règle d'or

Les phases 1–9 ont été validées sur un ancien modèle. D-047 remplace ce modèle ; leur traduction révisée est soumise à revue, **pas automatiquement validée dans tous ses détails**. Lire les propositions P-001 à P-003 et les points ouverts dans [le journal](docs/DECISIONS.md).

Ne pas modifier le périmètre sans amender la phase concernée et le journal. Ne pas prendre une proposition pour une décision utilisateur. La présente révision est documentaire : elle ne change ni code, ni base, ni déploiement.

## À lire avant de coder

- [Méthode et statut des phases](docs/00-process.md).
- [Décisions et propositions](docs/DECISIONS.md).
- [MVP](docs/03-mvp.md), [spécifications](docs/02-specifications-fonctionnelles.md), [UX](docs/04-ux.md).
- [Modèle cible et transition depuis le code existant](docs/06-modele-donnees.md).
- [Sécurité](docs/07-securite.md).
- [Backlog et avancement observé](docs/09-backlog.md).
- [Modèle économique à arbitrer](docs/10-modele-economique.md).

## Stack conservée

TypeScript, Next.js App Router, Tailwind CSS, HeroUI ; PostgreSQL/Prisma ; Auth.js email/mot de passe + Google OAuth ; Resend, Sentry, stockage S3-compatible prévu pour les logos. pnpm, ESLint/Prettier, Vitest et cible Playwright. Pas de remise à zéro technique.

## État réel et transition

Référence inspectée : commit `373565da4dddb91722c7691179db604af68800f9`.

Le socle local et une partie du parcours de comptes existent : inscription, vérification email, validation/rejet admin, paramètres et tests. L'annuaire, la publication d'offres et le contact ne sont pas encore livrés. La présence de code ne vaut ni validation d'épic, ni preuve de sécurité, ni tests réussis.

Le code et Prisma utilisent encore `ORGANISATEUR`, `Intervenant` et `ActivityIntervenant`. La cible proposée est `PRESTATAIRE`/`ADMIN`, sans carnet obligatoire. **Ne pas renommer en masse ni supprimer des tables** : suivre l'itération R0, inventorier les données et faire valider la migration.

## Conventions

- Une branche par tâche, PR obligatoire ; ne pas fusionner sans demande de l'utilisateur.
- Au relevé, la seule branche est `claude/educonnect-product-scoping-a3hi4u`. `main` est une cible prévue, pas une branche existante. Créer les branches de travail depuis la branche réelle ; ne pas créer/renommer `main` implicitement.
- La CI actuelle ne cible que `main` : une PR vers la branche actuelle ne prouve pas une CI verte. Voir le backlog.
- Conventional Commits ; migrations Prisma versionnées ; aucun secret dans Git.
- D-041 : tests des critères d'acceptation, CI verte sur la branche d'intégration, revue humaine des zones sensibles (auth, permissions, paiement futur), documentation à jour.
- Commandes locales et limites : [README](README.md).
