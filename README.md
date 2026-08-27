# EduConnect

Annuaire d'offres d'activités pédagogiques : **le prestataire proposant l'intervention publie ses offres et reçoit les demandes** des structures intéressées (D-047).

## État du projet

L'orientation prestataire est validée ; sa traduction documentaire est proposée à la revue. Voir [la méthode et les statuts](docs/00-process.md), [les décisions et propositions](docs/DECISIONS.md) et [le backlog](docs/09-backlog.md).

Le socle et une partie des comptes sont déjà codés. **Le code utilise encore l'ancien modèle Organisateur/Intervenant** : cette révision ne modifie ni l'application ni la base. L'itération R0 décrit la transition avant de poursuivre les fonctionnalités métier. Tests et fonctionnement applicatif non revérifiés dans cette révision documentaire.

Le pilote reste gratuit, sans paiement ni quota ; la vocation payante est cadrée séparément dans [les hypothèses économiques](docs/10-modele-economique.md). Aucun tarif validé.

Au relevé du commit `373565da4dddb91722c7691179db604af68800f9`, la branche d'intégration est `claude/educonnect-product-scoping-a3hi4u`, pas `main`. La CI cible encore `main` : à régulariser avant clôturer E0.

- Contexte commun pour le développement assisté (Claude Code / Codex) : [`CLAUDE.md`](CLAUDE.md)

## Développement local

Prérequis : Node.js ≥ 20, [pnpm](https://pnpm.io) ≥ 10, et une base **PostgreSQL** accessible en local (via Docker, **ou** une installation native — les deux fonctionnent).

### Configuration initiale (une seule fois)

```bash
# 1. Installer les dépendances
pnpm install

# 2. Copier les variables d'environnement
cp .env.example .env.local
# Renseigner AUTH_SECRET (ex. openssl rand -base64 32). Les autres variables
# (Google OAuth, Resend, Sentry) sont optionnelles en local : les fonctionnalités
# correspondantes se désactivent proprement si elles sont absentes.

# 3. Avoir une base de données PostgreSQL vide et son URL dans DATABASE_URL (.env.local)
```

Pour la base, deux options équivalentes :

**Option A — Docker** (si disponible) :
```bash
docker compose up -d
# DATABASE_URL déjà correcte par défaut dans .env.example pour cette option.
```

**Option B — PostgreSQL déjà installé nativement** (ex. Windows, sans Docker) : créer une base vide une fois, puis pointer `DATABASE_URL` dessus.
```bash
# Depuis psql (ou pgAdmin, ou l'outil de votre choix) :
psql -U postgres -c "CREATE DATABASE educonnect;"
```
Puis dans `.env.local` :
```
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/educonnect"
```
(adapter l'utilisateur/mot de passe à votre installation locale).

Enfin, créer votre compte Admin (une seule fois) :
```bash
pnpm create-admin
```

### Usage quotidien

```bash
pnpm dev
```

C'est la seule commande nécessaire à chaque session : `pnpm dev` applique automatiquement les migrations et les données de référence (thématiques, tranches d'âge) avant de démarrer le serveur — via les scripts du dépôt. Vérifiez toujours la base ciblée avant d'appliquer des migrations ; ne lancez pas cette commande sur une base de production.

L'application est alors disponible sur http://localhost:3000.

### Commandes utiles

| Commande | Effet |
|---|---|
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Vérification TypeScript stricte |
| `pnpm test` | Tests Vitest ; les tests de flux E1 nécessitent PostgreSQL |
| `pnpm test:e2e` | Commande Playwright prévue ; parcours E2E pas encore implémentés |
| `pnpm build` | Build de production |
| `pnpm create-admin` | Créer un compte Administrateur (CLI interactif) |
| `pnpm prisma:studio` | Interface d'exploration de la base de données |

### Note sur l'épic E0

Ce socle a été mis en place pour un développement **local** (pas de déploiement Vercel ni de base managée réels à ce stade — cf. plan d'implémentation d'E0). Le référentiel géographique complet (communes françaises) n'est pas chargé : seules quelques villes de test sont seedées ; le chargement complet est prévu à l'épic E2.
