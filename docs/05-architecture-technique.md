# Phase 5 — Architecture technique

Statut : 🟡 **En attente de validation**

Ce document traduit le MVP (Phase 3) et l'UX (Phase 4) en choix techniques concrets. Il sert de référence directe pour l'organisation du dépôt (Phase 8) et le développement (Phase 10). Les recommandations visent la simplicité et la maintenabilité pour une petite équipe/un lancement pilote, pas la scalabilité massive prématurée.

## 1. Objectif de la phase

Choisir une stack technique cohérente, justifiée par les contraintes déjà validées (web responsive, auth email + Google OAuth, messagerie, recherche simple en base, notifications email, budget gratuit au MVP, équipe probablement réduite), et documenter les composants d'infrastructure nécessaires.

## 2. Contraintes qui pèsent sur l'architecture (rappel)

- Auth email/mdp **+ Google OAuth** (D14) → besoin d'une solution d'authentification qui gère les deux nativement.
- Recherche via la base de données, pas de moteur dédié au MVP (D16) → le modèle de données doit rester compatible avec un ajout futur.
- Notifications in-app **+ email** (D11) → besoin d'un service d'envoi transactionnel.
- Messagerie interne temps quasi-réel (pas nécessairement du "vrai" temps réel au MVP — à trancher, cf. D23).
- UI kit existant, pas de sur-mesure (D19).
- Budget gratuit au lancement (D2) → privilégier des services avec un palier gratuit/faible coût pour un usage "région pilote".
- RGPD : anonymisation à la suppression (D12), consentement, données hébergées dans un cadre conforme (UE de préférence).
- Pas d'app mobile native (Phase 1) → un seul socle web responsive suffit.

## 3. Proposition de stack

### 3.1 Langage et framework applicatif
**Recommandation : TypeScript + Next.js** (React), en full-stack (une seule application gérant le front et les routes API/serveur).

Pourquoi :
- Un seul langage (TypeScript) sur tout le projet → plus simple à maintenir et à faire évoluer par une petite équipe (et par Claude Code).
- Next.js gère nativement le rendu web (pages publiques indexables pour l'annuaire — bon pour le SEO/acquisition, cohérent avec D13), les routes API, et s'intègre bien avec les UI kits recommandés (D19, ex. shadcn/ui).
- Écosystème très large, beaucoup de services (auth, email, hébergement) offrent une intégration de premier niveau.
- Alternative écartée : séparer frontend (ex. React/Vite) et backend (ex. Node/Express ou Django/Laravel) dans deux projets distincts → plus de flexibilité à terme, mais plus de complexité opérationnelle (deux déploiements, CORS, duplication de types) non justifiée pour un MVP.

### 3.2 Base de données
**Recommandation : PostgreSQL**, via un ORM **Prisma** (ou Drizzle — à trancher, cf. D22).

Pourquoi :
- Relationnel, adapté à un modèle avec beaucoup de relations (comptes, fiches, conversations, messages, signalements, taxonomie).
- Support natif de la recherche texte (`tsvector`/`pg_trgm`) suffisant pour D16 (recherche via la base), avec un chemin d'évolution clair vers un moteur dédié plus tard sans tout réécrire.
- Très largement supporté par les hébergeurs "gratuit pour démarrer" (Neon, Supabase, Railway...).

### 3.3 Authentification
**Recommandation : Auth.js (NextAuth)**, avec deux providers dès le MVP : Credentials (email + mot de passe, hashé avec bcrypt/argon2) et Google OAuth (D14).

Pourquoi : intégration native avec Next.js, gère nativement le cumul credentials + OAuth, évite d'implémenter à la main la sécurité sensible de l'authentification (cf. Phase 7).

### 3.4 Emails transactionnels
**Recommandation : Resend** (ou Postmark en alternative) pour les emails de notification (D11) : validation/rejet d'inscription, nouveau message, nouvelle demande de contact.

### 3.5 Stockage de fichiers
Nécessaire pour les logos/images de profil des structures. **Recommandation : stockage compatible S3** (ex. Cloudflare R2, ou le stockage intégré à l'hébergeur choisi) — pas de pièces jointes en messagerie au MVP (Phase 3 §3.2), donc besoin limité à quelques images par structure.

### 3.6 Messagerie interne — temps réel ou rafraîchissement
**Décision ouverte D23** — cf. section 6.

### 3.7 Hébergement et infrastructure
**Recommandation : Vercel** pour l'application Next.js (déploiement continu simple, palier gratuit adapté à un lancement pilote), + **Neon ou Supabase** pour PostgreSQL managé (palier gratuit disponible, région Europe disponible — important pour la conformité RGPD, cf. Phase 7).

### 3.8 Tests et qualité
- Tests unitaires/composants : **Vitest** (+ Testing Library pour les composants React).
- Tests end-to-end des parcours critiques (inscription, publication de fiche, contact) : **Playwright**.
- Lint/format : ESLint + Prettier, TypeScript strict activé dès le départ.

### 3.9 CI/CD
**Recommandation : GitHub Actions** — lint + typecheck + tests à chaque pull request, déploiement automatique sur Vercel après merge sur la branche principale.

## 4. Vue d'ensemble (schéma logique)

```
                 ┌─────────────────────────┐
   Visiteur /    │   Next.js (TypeScript)  │
   Intervenant / │  - Pages publiques      │
   Organisateur /│  - Espaces authentifiés │
   Admin ────────│  - Routes API           │
   (navigateur)  │  - Auth.js (credentials │
                 │    + Google OAuth)      │
                 └───────────┬─────────────┘
                             │ Prisma (ORM)
                             ▼
                 ┌─────────────────────────┐
                 │   PostgreSQL (managé)   │
                 └─────────────────────────┘
                             │
                 ┌───────────┴─────────────┐
                 ▼                          ▼
        ┌────────────────┐        ┌──────────────────┐
        │ Service email   │        │ Stockage fichiers │
        │ (Resend)        │        │ (S3-compatible)   │
        └────────────────┘        └──────────────────┘
```

## 5. Journalisation et observabilité minimale

- Journal des actions admin (validation, rejet, suspension, édition, traitement de signalement) : table dédiée en base (cf. Phase 6), pas de service externe nécessaire au MVP.
- Logs applicatifs et erreurs : solution intégrée à l'hébergeur (Vercel) au MVP ; un service dédié (ex. Sentry) est une évolution recommandée mais non bloquante pour le lancement pilote (cf. D24).

## 6. Décisions à prendre pour valider cette phase

### D21 — Stack applicative (confirmation)
Confirmer TypeScript + Next.js + PostgreSQL + Prisma comme socle, ou préférence différente (ex. équipe déjà expérimentée sur une autre stack) ?

### D22 — ORM
**Prisma** (recommandé, écosystème mature, migrations simples) vs **Drizzle** (plus léger, plus proche du SQL, monte en popularité) ?

### D23 — Messagerie : temps réel ou rafraîchissement périodique
- **Option A (recommandée MVP)** : rafraîchissement au chargement/polling léger (ex. toutes les 10-15s dans une conversation ouverte). Simple, pas d'infrastructure supplémentaire (pas de WebSocket à opérer).
- **Option B** : temps réel complet (WebSocket, ex. Pusher/Ably ou solution auto-hébergée). Meilleure expérience mais complexité et coût supplémentaires non indispensables pour valider le concept.

### D24 — Monitoring des erreurs
Ajouter un service de monitoring d'erreurs (ex. Sentry, palier gratuit disponible) dès le MVP, ou s'appuyer uniquement sur les logs de l'hébergeur au départ ?

### D25 — Environnements
Combien d'environnements dès le MVP : uniquement `production`, ou `production` + `staging/préproduction` ? **Recommandé : au moins `production` + `preview`** (Vercel génère des previews par pull request automatiquement, sans coût/effort supplémentaire notable) — un `staging` persistant distinct est optionnel au MVP.

## 7. Risques identifiés (niveau architecture)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Dépendance forte à des services tiers gratuits (Vercel, Neon/Supabase, Resend) dont les paliers gratuits peuvent devenir payants avec la croissance | Moyenne (à terme) | Moyen | Paliers connus et raisonnables pour un volume "région pilote" ; migration possible plus tard sans réécriture majeure (standards ouverts : PostgreSQL, SMTP/API email standard) |
| Choix Next.js full-stack limite la séparation front/back si une app mobile native devient nécessaire plus tard | Faible à court terme | Moyen | Les routes API restent réutilisables par un futur client mobile ; pas de blocage architectural |
| Hébergement hors UE par défaut sur certains services (à vérifier) → risque RGPD | Moyenne si non vérifié | Élevé | Choisir explicitement une région d'hébergement UE pour la base de données et le stockage de fichiers (cf. Phase 7) |
| Absence de moteur de recherche dédié (D16) devient limitant si le volume de données grossit vite après un succès du pilote | Faible au lancement | Moyen | Modèle de données pensé pour ne pas bloquer une migration vers un moteur dédié (Phase 6) |

## 8. Alternatives envisagées et écartées

- **Architecture microservices** : écartée — sur-ingénierie manifeste pour un MVP porté par une petite équipe ; un monolithe modulaire (Next.js) est plus simple à développer, tester et déployer.
- **Backend séparé en Django ou Laravel avec frontend React distinct** : écarté — ajoute deux bases de code et deux déploiements pour un bénéfice non justifié au stade MVP ; réévaluable si l'équipe technique cible a une expertise forte et préexistante sur l'une de ces stacks (question à l'utilisateur si ce n'est pas le cas).
- **Firebase/backend-as-a-service complet** : écarté par défaut — moins de contrôle sur le modèle de données relationnel riche nécessaire ici (comptes, fiches, conversations, modération), et verrouillage fournisseur plus fort ; PostgreSQL managé offre un meilleur compromis contrôle/rapidité.

## 9. Critères de validation de la phase

- [ ] D21 à D25 tranchées.
- [ ] Stack jugée réaliste vis-à-vis des compétences disponibles (à confirmer par l'utilisateur : équipe technique interne, prestataire, ou développement piloté principalement par Claude Code).
- [ ] Risques d'hébergement/RGPD jugés couverts à ce stade (détail complet en Phase 7).
