# Phase 5 — Architecture technique

Statut : **choix techniques conservés** ; nettoyage des références à la messagerie et à l'ancien modèle (2026-08-27). La documentation décrit une cible, pas un déploiement attesté.

## 1. Objectif

Réutiliser le socle existant pour l'annuaire d'offres de prestataires. Le pivot métier ne justifie ni changement de framework ni réécriture complète.

## 2. Composants retenus

| Besoin | Choix |
|---|---|
| Application web full-stack | TypeScript, Next.js App Router |
| Interface | Tailwind CSS et HeroUI personnalisé |
| Base | PostgreSQL et Prisma, migrations versionnées |
| Authentification | Auth.js : email/mot de passe et Google OAuth |
| Recherche | Base relationnelle, pagination et filtres |
| Email transactionnel | Resend |
| Erreurs | Sentry |
| Logos | Stockage compatible S3 prévu, configuration à réaliser |
| Qualité | pnpm, ESLint/Prettier, TypeScript, Vitest et Playwright |
| Livraison cible | GitHub Actions ; Vercel production et previews par PR |

Les choix D-021/D-022/D-024/D-025 sont conservés. Aucun tarif actuel de fournisseur ni gratuité d'usage commercial n'est garanti ici : vérifier les offres et conditions avant choisir le déploiement.

## 3. Séparation des responsabilités

- Pages et composants : présentation, formulaires et états de chargement.
- Services serveur : validation, rôles/statuts, propriété, publication, destinataire des demandes.
- Prisma/PostgreSQL : persistance, relations, transactions et requêtes.
- Service email : notification/transmission ; ne décide ni du propriétaire ni des permissions.
- Stockage de fichiers : accès et validation des uploads indépendants du contenu affiché.

Le formulaire crée une ContactRequest persistée puis déclenche l'envoi. Ni Conversation, ni Message, ni WebSocket, ni polling de chat au MVP. D-023 n'a plus d'application dans cette version.

## 4. Adaptation au modèle prestataire

L'entité Structure devient le profil du prestataire ; Activity reste son offre. Le rôle cible proposé est PRESTATAIRE au lieu d'ORGANISATEUR. La migration et le retrait du carnet obligatoire relèvent de R0, pas d'une modification de documentation exécutée en base.

Les données géographiques restent structurées (D-027). La zone desservie par une offre ne se déduit pas du siège : P-002 doit précéder son implémentation. Aucun moteur dédié, microservice, backend séparé ou application native ajouté.

## 5. Auth et sécurité

La présence d'un provider Auth.js ne suffit pas à livrer tout le parcours métier : vérifier la création/liaison du compte local, le profil, le rôle, l'email vérifié, le statut et la révocation des accès. Ne pas considérer OAuth comme terminé sur la seule présence de sa configuration.

Voir [Sécurité](07-securite.md) pour anti-spam, contrôle d'accès, protection des fichiers, minimisation et audit. Aucun flux de paiement dans le socle pilote.

## 6. Environnements et qualité

Cible : développement local, previews isolées et production. Vérifier région d'hébergement, contrats, secrets, sauvegardes quotidiennes/rétention 7 jours (D-035) et restauration avant ouverture.

Pipeline attendu : installation, génération Prisma, lint/typecheck, migration de la base de test, tests, build et E2E critiques. Utiliser des données synthétiques pour tests/previews ; ne pas pointer les tests sur la production.

Au commit inspecté, le workflow ne cible que `main`, qui n'existe pas ; les tests E2E ne sont pas encore implémentés. Voir [backlog](09-backlog.md). Ne pas confondre configuration présente, exécution réussie et validation de recette.

## 7. Alternatives et risques

- Microservices/backend séparé : complexité non justifiée pour cette V1.
- Recherche dédiée et temps réel : hors besoin actuel.
- Dépendances de services : suivre coûts, limites, régions et disponibilité ; ne pas promettre un fonctionnement gratuit durable.
- Désynchronisation docs/code : état et migration explicitement suivis en R0.
- Sécurité reportée à l'audit final : écartée ; exigences appliquées pendant chaque épic, audit D-034 avant production.

## 8. Critères

- [x] Stack conservée.
- [ ] Transition prestataire revue puis testée.
- [ ] Pipeline réellement exécuté sur la branche d'intégration.
- [ ] Hébergement et services configurés et vérifiés ; aucune validation de production dans cette PR documentaire.
