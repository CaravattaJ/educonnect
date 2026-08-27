# Phase 6 — Modèle de données

Statut : ✅ **Validée** (amendée le 2026-08-27 — réécriture pour le pivot de modèle)

> **Amendement du 2026-08-27 (pivot de modèle)** : ce document est intégralement réécrit. Le modèle passe de "Intervenants avec compte publiant des fiches mission" à un **annuaire d'activités** : l'Organisateur (seul rôle "métier", avec l'Admin) publie ses propres `Activity`, chacune déclarant au moins un `Intervenant` — une fiche de référence **sans compte**, créée et réutilisable par l'Organisateur, modérée par l'admin. Voir `docs/01-cadrage-produit.md`, `docs/02-specifications-fonctionnelles.md`, `docs/03-mvp.md` et `docs/DECISIONS.md` (D-042 à D-045).

Ce document dérive directement des Phases 1 à 5 révisées (rôles Organisateur/Admin, activités, intervenants sans compte, modération, taxonomie fermée, auth email + Google OAuth, Prisma/PostgreSQL, référentiel géographique structuré, contact par formulaire simple). Il sert de référence directe pour écrire le schéma Prisma en Phase 10.

## 1. Objectif de la phase

Définir les entités, leurs champs, leurs relations, les énumérations de statuts, et les règles d'intégrité — suffisamment précisément pour générer le schéma Prisma sans ambiguïté, et pour que la Phase 7 (Sécurité) puisse raisonner sur les données sensibles.

## 2. Vue d'ensemble des entités (périmètre MVP)

```
Region 1─N Department 1─N City                       (référentiel géographique, D27)
                             │
User (compte, auth — ORGANISATEUR | ADMIN) 1─1 Structure ──N─1── City (siège)
                          │
                          │ 1─N
                          ├──────────────────────┐
                          ▼                       ▼
                    Intervenant             Activity ──N─1── City (zone d'intervention)
                    (fiche sans compte,           │        └──N─M── Theme (taxonomie)
                     appartient à                 │        └──N─M── Audience (taxonomie)
                     l'Organisateur créateur)      │
                          │                        │
                          └──────N─M───────────────┘
                             (ActivityIntervenant)

ContactRequest ──N─1── Activity
               └─N─1── Structure (Organisateur destinataire, dénormalisé depuis Activity.structureId)

Report (signalement) ──N─1 User (auteur du signalement)
                       └─N─1 (contenu signalé : Structure | Activity | Intervenant, cf. §4.1)

AdminAction (journal d'audit) ──N─1 User (admin auteur)
                                └─N─1 (cible : User | Structure | Activity | Intervenant | Report | Theme | Audience)

Notification ──N─1 User (destinataire)
```

Note : `User` ne porte plus que deux rôles possibles (`ORGANISATEUR`, `ADMIN`). `Structure` est désormais systématiquement le profil d'un Organisateur (le champ `structureKind` disparaît, il n'y a plus qu'un seul type de structure). `Intervenant` est une **nouvelle entité sans lien vers `User`** : elle appartient (FK) à la `Structure` de l'Organisateur qui l'a créée, n'est pas partagée entre Organisateurs, et n'a pas de compte propre. **`Conversation`/`Message` ne font toujours pas partie du modèle MVP** (cf. amendement précédent, D30) — le contact se fait via `ContactRequest` vers l'Organisateur propriétaire de l'activité.

## 3. Entités et champs

### 3.1 `User`
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| email | string, unique | |
| passwordHash | string, nullable | null si créé uniquement via Google OAuth |
| googleId | string, nullable, unique | présent si compte lié à Google (D14) |
| role | enum `ORGANISATEUR` \| `ADMIN` | fixé à la création, non modifiable *(révisé : `INTERVENANT` retiré de l'énumération)* |
| accountStatus | enum `EN_ATTENTE` \| `ACTIF` \| `REJETE` \| `SUSPENDU` \| `ANONYMISE` | cf. §5 — sans objet pour un `ADMIN` (créé directement `ACTIF`, cf. Phase 7 §4) |
| rejectionReason | string, nullable | motif si `REJETE` |
| createdAt / updatedAt | datetime | |
| anonymizedAt | datetime, nullable | rempli lors de la suppression de compte (D12) |

### 3.2 `Structure` (profil de l'Organisateur)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| userId | UUID, unique | FK → `User` (relation 1-1, `role = ORGANISATEUR`) |
| name | string | raison sociale / nom de la structure |
| description | text | |
| logoUrl | string, nullable | stockage S3-compatible (Phase 5 §3.5) |
| website | string, nullable | |
| contactEmail | string | email de contact utilisé pour transmettre les `ContactRequest` (D30) — jamais exposé publiquement, peut différer de `User.email` |
| cityId | UUID | FK → `City` (référentiel structuré, D27) |
| createdAt / updatedAt | datetime | |

*(Champ `structureKind` retiré — il n'existe plus qu'un seul type de structure.)*

### 3.3 `Intervenant` *(nouvelle entité — fiche sans compte)*
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| structureId | UUID | FK → `Structure` — l'Organisateur propriétaire/créateur de la fiche |
| name | string | nom de l'intervenant (personne ou structure) |
| description | text, nullable | |
| contactEmail | string, nullable | usage interne uniquement (jamais exposé publiquement), pour référence de l'Organisateur |
| status | enum `EN_ATTENTE` \| `VALIDEE` \| `REJETEE` \| `DESACTIVEE` | modération admin (D44) |
| rejectionReason | string, nullable | motif si `REJETEE` |
| createdAt / updatedAt | datetime | |

Règle : une fiche `Intervenant` n'est utilisable/affichable sur une activité **publiée** que si `status = VALIDEE` (D45). Une édition significative d'une fiche déjà validée la repasse en `EN_ATTENTE` (règle applicative, cf. Phase 2 §3.2).

### 3.4 `Activity` (remplace `MissionListing` — publiée par l'Organisateur)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| structureId | UUID | FK → `Structure` — l'Organisateur qui publie l'activité |
| title | string | |
| description | text | |
| format | enum `PRESENTIEL` \| `DISTANCIEL` \| `HYBRIDE` | |
| cityId | UUID | FK → `City` — lieu de l'activité |
| budgetIndicative | string, nullable | texte libre volontairement (fourchette, "sur devis"...) |
| availabilityNote | text, nullable | disponibilité en texte libre au MVP |
| status | enum `BROUILLON` \| `PUBLIEE` \| `DEPUBLIEE` | passage à `PUBLIEE` bloqué tant qu'un `Intervenant` associé n'est pas `VALIDEE` (D45, contrôle applicatif) |
| publishedAt | datetime, nullable | |
| createdAt / updatedAt | datetime | |

Relations N-N :
- `Activity` ↔ `Intervenant` (table de jointure `ActivityIntervenant`) — **au moins un** intervenant requis pour publier (contrainte applicative, pas une contrainte SQL stricte de cardinalité minimale).
- `Activity` ↔ `Theme` (table de jointure `ActivityTheme`)
- `Activity` ↔ `Audience` (table de jointure `ActivityAudience`)

### 3.5 `Theme` et `Audience` (taxonomie fermée, D10)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| label | string, unique | |
| active | boolean, default true | désactivation plutôt que suppression si déjà utilisé |
| createdAt / updatedAt | datetime | |

### 3.6 `Region`, `Department`, `City` (référentiel géographique — D27)
| Entité | Champs clés | Notes |
|---|---|---|
| `Region` | id, code (code INSEE région), name | |
| `Department` | id, code (code INSEE département), name, regionId (FK) | |
| `City` | id, inseeCode, postalCode, name, departmentId (FK) | source : référentiel officiel, chargé au déploiement initial, pas de CRUD utilisateur |

### 3.7 `ContactRequest` (formulaire de contact — vers l'Organisateur)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| activityId | UUID | FK → `Activity` |
| recipientStructureId | UUID | FK → `Structure` — dénormalisé depuis `Activity.structureId` au moment de l'envoi (traçabilité même si l'activité change de propriétaire ultérieurement, cas non prévu au MVP mais robustesse minimale) |
| authorName | string | nom saisi par le visiteur (pas de compte requis) |
| authorEmail | string | email de réponse saisi par le visiteur |
| message | text | |
| status | enum `ENVOYE` \| `ECHEC_ENVOI` | résultat de l'envoi email |
| emailSentAt | datetime, nullable | |
| createdAt | datetime | |

*(Révisé : `intervenantStructureId`/`organisateurStructureId` remplacés — il n'y a plus deux structures avec compte de part et d'autre du contact, seulement l'Organisateur destinataire et un visiteur non authentifié émetteur.)*

### 3.8 `Report` (signalement)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| authorUserId | UUID, nullable | FK → `User` — nullable car un visiteur non connecté peut aussi signaler (cf. décision D46, §7) |
| authorEmail | string, nullable | requis si `authorUserId` est nul |
| targetType | enum `STRUCTURE` \| `ACTIVITY` \| `INTERVENANT` | référence polymorphe (cf. §4.1) — `INTERVENANT` ajouté |
| targetId | UUID | |
| reason | text | |
| status | enum `OUVERT` \| `TRAITE_IGNORE` \| `TRAITE_ACTION` | |
| resolvedByUserId | UUID, nullable | FK → `User` (admin) |
| resolutionNote | text, nullable | |
| createdAt / resolvedAt | datetime | |

### 3.9 `AdminAction` (journal d'audit — obligatoire)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| adminUserId | UUID | FK → `User` |
| actionType | enum `VALIDATION_INSCRIPTION` \| `REJET_INSCRIPTION` \| `VALIDATION_INTERVENANT` \| `REJET_INTERVENANT` \| `SUSPENSION_COMPTE` \| `REACTIVATION_COMPTE` \| `EDITION_COMPTE` \| `EDITION_ACTIVITE` \| `EDITION_INTERVENANT` \| `TRAITEMENT_SIGNALEMENT` \| `GESTION_TAXONOMIE` | *(révisé : actions liées à `Intervenant` ajoutées, `EDITION_FICHE` renommé `EDITION_ACTIVITE`)* |
| targetType | enum `USER` \| `STRUCTURE` \| `ACTIVITY` \| `INTERVENANT` \| `REPORT` \| `THEME` \| `AUDIENCE` | |
| targetId | UUID | |
| justification | text | obligatoire |
| createdAt | datetime | immuable |

### 3.10 `Notification`
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → `User`, destinataire (toujours un Organisateur ou un Admin) |
| type | enum `INSCRIPTION_VALIDEE` \| `INSCRIPTION_REJETEE` \| `INTERVENANT_VALIDE` \| `INTERVENANT_REJETE` \| `NOUVELLE_DEMANDE_CONTACT` \| `SIGNALEMENT_TRAITE` | *(révisé : notifications liées à `Intervenant` ajoutées)* |
| payload | JSON | données contextuelles (ex. id de `ContactRequest` ou `Intervenant`) |
| readAt | datetime, nullable | |
| emailSentAt | datetime, nullable | |
| createdAt | datetime | |

## 4. Points de modélisation à clarifier

### 4.1 Référence polymorphe (`Report.targetId`, `AdminAction.targetId`)
`targetType` + `targetId`, sans FK native, intégrité garantie au niveau applicatif (D29, inchangé).

### 4.2 Anonymisation (D12)
À la suppression de compte : `User.email`, `passwordHash`, `googleId` anonymisés ; `Structure.name/description/logoUrl/contactEmail/website` anonymisés ; les `Activity` associées passent en `DEPUBLIEE` ; les fiches `Intervenant` associées passent en `DESACTIVEE` (elles ne peuvent plus être utilisées sur une nouvelle activité, mais restent visibles en historique sur les activités déjà publiées avant anonymisation, avec mention "Organisateur supprimé"). Le détail complet est traité en Phase 7.

### 4.3 Cardinalité minimale "au moins un Intervenant" (§3.4)
PostgreSQL/Prisma ne permet pas nativement d'imposer "au moins une ligne de jointure" comme contrainte de schéma. Contrôle fait au niveau applicatif, à la tentative de passage en statut `PUBLIEE` (Phase 7 — validation serveur systématique, jamais une confiance dans le client).

## 5. Diagramme d'états — `User.accountStatus`

```
EN_ATTENTE ──(validation admin)──> ACTIF ──(suspension admin)──> SUSPENDU ──(réactivation admin)──> ACTIF
    │                                │                                                                  
    └──(rejet admin)──> REJETE       └──(suppression par l'utilisateur)──> ANONYMISE
                            │
                            └──(correction + resoumission)──> EN_ATTENTE
```

## 6. Diagramme d'états — `Intervenant.status`

```
EN_ATTENTE ──(validation admin)──> VALIDEE ──(désactivation Organisateur ou admin)──> DESACTIVEE
    │                                  │
    └──(rejet admin)──> REJETEE        └──(édition significative)──> EN_ATTENTE
```

## 7. Diagramme d'états — `Activity.status`

```
BROUILLON ──(publier, si ≥1 Intervenant VALIDEE)──> PUBLIEE ──(dépublier)──> DEPUBLIEE ──(republier)──> PUBLIEE
```

## 8. Décisions — validées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D26 | `User` (auth, rôle, statut) **séparé** de `Structure` (profil métier), relation 1-1. *(inchangé, s'applique désormais uniquement au rôle Organisateur)* |
| D27 | **Référentiel géographique structuré** (`Region`/`Department`/`City`), pas de texte libre. *(inchangé)* |
| D29 | Références polymorphes en `targetType` + `targetId`, sans FK native. *(inchangé)* |
| D30 | `ContactRequest` remplace la messagerie, cible désormais l'Organisateur (dénormalisé via `recipientStructureId`) plutôt qu'un "Intervenant" avec compte. |
| D42-D45 | Pivot de modèle (annuaire d'activités, deux rôles, fiches Intervenant modérées, règle de publication) — détaillé dans ce document. |
| D46 | Signalement ouvert aux visiteurs non connectés (`Report.authorUserId` nullable) — cf. §7 risques, cohérent avec le fait que la consultation/contact ne nécessite pas de compte. |

## 9. Risques identifiés (niveau modèle de données)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Un Organisateur crée une fiche Intervenant fictive ou trompeuse pour publier plus vite (pas de "double compte" indépendant pour contrebalancer) | Moyenne | Moyen | Validation admin systématique de chaque fiche Intervenant (D44) avant utilisation sur une activité publiée ; signalement a posteriori possible sur l'activité ou la fiche |
| Signalement ouvert aux visiteurs anonymes (D46) sans email vérifié facilite les faux signalements | Faible-moyenne | Faible | Traçabilité par `authorEmail`/IP au niveau applicatif (Phase 7), un admin peut identifier un pattern abusif |
| Référentiel géographique structuré (D27) nécessite une source de données fiable et sa maintenance | Faible | Faible | Source officielle (API Géo), mise à jour ponctuelle |
| Suppression "en cascade" mal maîtrisée (ex. suppression d'un `Theme` utilisé par des activités publiées) | Faible (désactivation plutôt que suppression) | Moyen | Contrainte applicative : un `Theme`/`Audience` inactif reste affiché sur les activités existantes mais n'est plus sélectionnable pour une nouvelle activité |
| `ContactRequest` sans garde-fou anti-spam si non implémenté avec rigueur | Moyenne | Moyen | Throttling applicatif obligatoire dès la Phase 10 (Phase 7) |

## 10. Alternatives envisagées et écartées

- **Faire de `Intervenant` une sous-catégorie de `User`/`Structure` avec un statut "sans compte actif"** : écarté — ajoute de la complexité (un `User` sans email de connexion réel, des champs `nullable` partout) pour un bénéfice nul, puisque l'Intervenant n'a par définition aucune action à faire sur la plateforme.
- **Fiches Intervenant partagées entre Organisateurs (déduplication par nom/email)** : écartée au MVP (cf. Phase 2 §9) — chaque fiche reste scopée à son Organisateur créateur, plus simple à modérer et à sécuriser (pas de fusion de données entre comptes différents).
- **Contrainte SQL stricte pour "au moins un Intervenant par activité publiée"** : écartée — PostgreSQL ne l'exprime pas nativement de façon simple pour une relation N-N ; le contrôle applicatif au moment de la publication est suffisant et plus lisible.

## 11. Critères de validation de la phase

- [x] D26, D27, D29, D30 (révisée), D42-D46 tranchées.
- [x] Entités et champs jugés complets pour couvrir le périmètre MVP pivoté (Organisateur, Intervenant sans compte, Activity).
- [x] Diagrammes d'état validés (User, Intervenant, Activity).
- [x] Règle de publication (≥1 Intervenant validé) jugée suffisamment claire pour la Phase 10.

**Phase 6 validée le 2026-08-27, réécrite le 2026-08-27 (pivot de modèle).** → Phase 7 (Sécurité) à réviser pour le RBAC à deux rôles.
