# Phase 8 — Organisation du dépôt

Statut : ✅ **Validée**

Ce document fixe la structure du dépôt, les conventions et le flux de travail Git avant le premier commit de code (Phase 10). Objectif : un dépôt lisible et cohérent dès le départ, exploitable directement par Claude Code.

## 1. Objectif de la phase

Définir l'arborescence du projet applicatif, les conventions de code/commit/branches, et la configuration nécessaire (CI, environnements, secrets) — pour que la Phase 10 démarre sur une base saine sans décisions structurelles à improviser en cours de route.

## 2. Arborescence proposée

```
educonnect/
├── docs/                        # documentation de cadrage (déjà en place, phases 1-9)
│   ├── 00-process.md
│   ├── 01-cadrage-produit.md … 09-backlog.md
│   └── DECISIONS.md
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (public)/            # pages publiques : accueil, annuaire, fiche, connexion/inscription
│   │   ├── (intervenant)/       # espace Intervenant (protégé par middleware de rôle)
│   │   ├── (organisateur)/      # espace Organisateur (protégé)
│   │   ├── (admin)/             # espace Administration (protégé)
│   │   └── api/                 # routes API (auth, webhooks éventuels)
│   ├── components/
│   │   ├── ui/                  # wrappers/thème HeroUI (D21), composants génériques
│   │   └── features/            # composants spécifiques à un domaine (fiche mission, recherche, etc.)
│   ├── lib/
│   │   ├── auth/                # configuration Auth.js (D14)
│   │   ├── db/                  # client Prisma, requêtes partagées
│   │   ├── email/                # intégration Resend, templates
│   │   ├── validation/           # schémas Zod partagés (Phase 7 §7)
│   │   └── permissions/          # helpers de contrôle d'accès par rôle (Phase 7 §4)
│   ├── server/                  # logique métier serveur (services), appelée par les routes/actions
│   └── types/                   # types partagés
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                  # jeu de données de démarrage (taxonomie D10, référentiel géo D27)
├── tests/
│   ├── unit/
│   └── e2e/                     # Playwright (Phase 5 §3.8)
├── public/                      # assets statiques
├── .github/
│   └── workflows/                # CI GitHub Actions (Phase 5 §3.9)
├── .env.example
├── CLAUDE.md                    # instructions de contexte pour Claude Code (cf. §5)
├── README.md
└── package.json
```

## 3. Conventions

### 3.1 Nommage
- Fichiers de composants React : `PascalCase.tsx`.
- Autres fichiers TypeScript : `camelCase.ts`.
- Routes Next.js (dossiers) : `kebab-case`.
- Tables/champs Prisma : `PascalCase` pour les modèles, `camelCase` pour les champs (convention Prisma standard, mappée automatiquement en `snake_case` côté SQL si besoin).

### 3.2 Gestion des branches
- Branche principale : `main`, toujours déployable (protégée : pas de push direct, uniquement via pull request).
- Une branche par fonctionnalité/tâche du backlog (ex. `feat/fiche-mission-crud`, `fix/recherche-filtre-vide`), créée depuis `main`.
- Pull request obligatoire avant fusion dans `main`, avec CI verte (lint + typecheck + tests) comme condition de fusion.
- Pas de branche `develop` intermédiaire : flux "trunk-based" simple, cohérent avec un déploiement continu via Vercel (previews par PR, Phase 5 §3.7/§D25).

### 3.3 Convention de commits
**Recommandation : Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`) — facilite la lecture de l'historique et rend possible une génération automatique de changelog plus tard si besoin.

### 3.4 Migrations de base de données
- Toute évolution du schéma passe par une migration Prisma versionnée (`prisma migrate dev` en local, `prisma migrate deploy` en CI/production) — jamais de modification manuelle du schéma en production.
- Le fichier `seed.ts` initialise les données de référence nécessaires au fonctionnement (taxonomie D10, référentiel géographique D27, premier compte admin) — pas de données de démonstration fictives en production.

### 3.5 Gestion des secrets et environnements
- `.env.example` documente toutes les variables nécessaires (`DATABASE_URL`, secrets Auth.js, clé Google OAuth, clé API Resend, DSN Sentry, credentials stockage fichiers) sans valeurs réelles.
- Les valeurs réelles sont configurées directement dans Vercel (variables d'environnement par environnement : production / preview), jamais commitées (cf. Phase 7 §7).

## 4. CI (GitHub Actions)

Pipeline minimal sur chaque pull request :
1. Installation des dépendances.
2. Lint (ESLint) + typecheck (`tsc --noEmit`).
3. Tests unitaires (Vitest).
4. Tests end-to-end critiques (Playwright) — au moins sur les parcours listés en Phase 9 (backlog), pas nécessairement l'intégralité au tout début.
5. Build Next.js (garantit qu'aucune erreur de build ne passe en revue).

Fusion dans `main` bloquée tant que le pipeline n'est pas vert (branch protection GitHub).

## 5. `CLAUDE.md` — contexte pour le développement assisté

Un fichier `CLAUDE.md` à la racine du dépôt sera créé au démarrage de la Phase 10, résumant :
- Les décisions structurantes de `docs/DECISIONS.md` (liens directs).
- Les commandes utiles (dev, test, lint, migration).
- Les conventions de ce document (§3).
- Un rappel explicite : **ne pas modifier le périmètre fonctionnel sans revenir amender la documentation de phase concernée** (cohérent avec la méthode, `docs/00-process.md`).

## 6. Décisions — validées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D36 | **pnpm** comme gestionnaire de paquets. |
| D37 | **Configuration de lint/format renforcée** dès le départ (règles strictes supplémentaires : interdiction de `any` implicite, complexité cyclomatique limitée, imports ordonnés) — à documenter précisément dans la config ESLint au début de la Phase 10. |
| D38 | **Dossier `tests/` centralisé** (`tests/unit/`, `tests/e2e/`), conforme à l'arborescence proposée en §2 — pas de colocalisation des tests unitaires avec le code applicatif. |
| D39 | **Revue humaine obligatoire uniquement sur les zones sensibles** (authentification, permissions/RBAC, tout ce qui touchera un futur paiement) ; CI verte suffisante pour fusionner le reste, adapté à une équipe réduite. |

## 7. Risques identifiés (niveau organisation du dépôt)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Documentation de cadrage (`docs/`) qui se désynchronise du code au fil du développement | Moyenne | Moyen | Toute décision qui remet en cause un document de phase antérieur doit être répercutée immédiatement (cf. `docs/00-process.md`, déjà appliqué lors de l'amendement de la Phase 3 en Phase 6) |
| CI trop permissive laisse passer des régressions | Faible avec le pipeline proposé | Moyen | Branch protection stricte sur `main`, pipeline bloquant (§4) |
| Absence de convention claire dès le début entraîne une incohérence de style au fil des contributions (humaines et Claude Code) | Moyenne si non cadré | Faible | Ce document + `CLAUDE.md` + lint/format automatisés dès le premier commit |

## 8. Alternatives envisagées et écartées

- **Monorepo avec plusieurs packages** (ex. `apps/web`, `packages/ui`, `packages/db`) : écarté pour le MVP — une seule application Next.js suffit (cf. Phase 5 §3.1), un monorepo ajouterait de la complexité d'outillage (workspaces, orchestration de build) sans bénéfice pour un seul déployable.
- **Git flow complet** (branches `develop`, `release/*`, `hotfix/*`) : écarté — trop lourd pour une petite équipe avec déploiement continu ; le flux trunk-based (§3.2) est plus adapté et cohérent avec Vercel.

## 9. Critères de validation de la phase

- [x] D36 à D39 tranchées.
- [x] Arborescence jugée claire et suffisante pour démarrer la Phase 10.
- [x] Conventions (nommage, branches, commits, migrations) validées.

**Phase 8 validée le 2026-08-27.** → Passage à la Phase 9 (Backlog).
