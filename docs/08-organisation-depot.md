# Phase 8 — Organisation du dépôt

Statut : **conventions conservées, état réel et transition documentés** (2026-08-27).

## 1. Objectif

Travailler par petites branches et PR, sans réinitialiser le projet ni confondre cible d'organisation et état existant.

## 2. Structure utile

| Chemin | Responsabilité |
|---|---|
| docs/ | Cadrage, décisions, backlog et note économique |
| src/app/ | Pages publiques, espaces protégés et routes serveur |
| src/components/ | Composants HeroUI et composants métier |
| src/lib/ | Auth, base, email, validation, permissions et monitoring |
| src/server/ | Actions et services métier |
| prisma/ | Schéma, migrations versionnées et seed |
| tests/unit/ | Tests unitaires et tests nécessitant la base identifiés explicitement |
| tests/e2e/ | Parcours Playwright à implémenter |
| scripts/create-admin.ts | Initialisation contrôlée du premier administrateur |
| .github/workflows/ | CI |
| CLAUDE.md | Instructions communes de contexte pour le développement assisté |

Le groupe de routes existant `(organisateur)` et ses services sont à adapter en R0 après validation. La cible fonctionnelle est un espace prestataire avec activités, demandes, profil et paramètres ; pas de carnet d'intervenants dans le parcours V1.

## 3. Branches et CI : état observé

Au commit `373565da4dddb91722c7691179db604af68800f9`, la seule branche relevée est `claude/educonnect-product-scoping-a3hi4u`. Le workflow CI filtre les événements push/PR sur `main`, branche absente.

Conséquences :
- Ne pas annoncer « CI verte » faute d'exécution.
- Créer une branche de tâche depuis la branche d'intégration réellement existante et cibler celle-ci dans la PR.
- Choisir explicitement la branche principale durable et adapter les déclencheurs/protections avant de clôturer E0 ; ne pas créer/renommer une branche implicitement.
- Une PR documentaire vers la branche actuelle n'établit pas une recette applicative.
- Ne pas fusionner sans demande de l'utilisateur.

La cible de travail reste simple : une branche par tâche, PR, contrôles effectifs et revue humaine sur les zones sensibles. Pas de branche develop nécessaire.

## 4. Conventions et migrations

Conventional Commits : docs, feat, fix, refactor, test, chore. Conserver les conventions des fichiers existants plutôt que renommer hors périmètre.

Migrations Prisma versionnées uniquement. Ne pas modifier les anciennes migrations déjà appliquées. La suppression de données/tables exige inventaire et validation spécifiques ; pas de reset pour simplifier R0.

Le seed charge des données de référence ; ne pas injecter de fausses offres en production. L'administrateur initial passe par le script dédié, pas par un compte public ou un secret codé en dur.

Secrets dans les environnements locaux/hébergeur, jamais dans Git. Aucun secret demandé dans une conversation ou une PR.

## 5. Pipeline cible et tests

Installation, génération Prisma avant vérification des types dépendants, lint, typecheck, migration de la base dédiée aux tests, tests, build, parcours E2E critiques. Adapter l'ordre effectif du workflow lors d'une tâche de code dédiée.

D-036 : pnpm ; D-037 : lint/format stricts ; D-038 : tests centralisés ; D-039 : revue humaine auth/permissions/futur paiement.

Le dossier tests/e2e contient actuellement seulement un fichier de maintien du dossier : la commande test:e2e existe, mais aucun parcours E2E n'est livré. Les tests de flux E1 utilisent une base : le libellé « unit » ne doit pas faire oublier leur dépendance PostgreSQL.

## 6. Risques, alternatives et critères

La désynchronisation docs/code est traitée par un état observé daté et un backlog de transition. Éviter les refactorings de nommage, changements d'hébergement ou restructurations sans rapport avec la tâche.

- [ ] Branche principale et CI effectivement configurées.
- [ ] PR et contrôles requis opérationnels.
- [ ] Tests E2E présents et exécutés avant clôture MVP.
- [ ] Migration R0 revue, sans perte de données implicite.
