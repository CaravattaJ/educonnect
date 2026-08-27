# EduConnect

Annuaire d'activités pédagogiques : chaque Organisateur publie ses propres activités, en déclarant pour chacune au moins un Intervenant (fiche sans compte, modérée par l'admin).

## État du projet

Le cadrage (Phases 1-9) est validé et amendé — voir [`docs/00-process.md`](docs/00-process.md) et le journal des décisions [`docs/DECISIONS.md`](docs/DECISIONS.md). Le développement (Phase 10) est en cours, épic par épic — voir [`docs/09-backlog.md`](docs/09-backlog.md).

- Contexte de développement pour Claude Code : [`CLAUDE.md`](CLAUDE.md)

## Développement local

Prérequis : Node.js ≥ 20, [pnpm](https://pnpm.io) ≥ 10, Docker.

```bash
# 1. Installer les dépendances
pnpm install

# 2. Copier les variables d'environnement
cp .env.example .env.local
# Renseigner AUTH_SECRET (ex. openssl rand -base64 32). Les autres variables
# (Google OAuth, Resend, Sentry) sont optionnelles en local : les fonctionnalités
# correspondantes se désactivent proprement si elles sont absentes.

# 3. Démarrer PostgreSQL en local
docker compose up -d

# 4. Appliquer le schéma et charger les données de référence
pnpm prisma:migrate
pnpm prisma:seed

# 5. Lancer le serveur de développement
pnpm dev
```

L'application est alors disponible sur http://localhost:3000.

### Commandes utiles

| Commande | Effet |
|---|---|
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Vérification TypeScript stricte |
| `pnpm test` | Tests unitaires (Vitest) |
| `pnpm test:e2e` | Tests end-to-end (Playwright) |
| `pnpm build` | Build de production |
| `pnpm prisma:studio` | Interface d'exploration de la base de données |

### Note sur l'épic E0

Ce socle a été mis en place pour un développement **local** (pas de déploiement Vercel ni de base managée réels à ce stade — cf. plan d'implémentation d'E0). Le référentiel géographique complet (communes françaises) n'est pas chargé : seules quelques villes de test sont seedées ; le chargement complet est prévu à l'épic E2.
