# Phase 6 — Modèle de données

Statut : ✅ **Validée**

Ce document dérive directement des Phases 1 à 5 (rôles, statuts, fiches mission, modération, taxonomie fermée, auth email + Google OAuth, Prisma/PostgreSQL) et intègre l'amendement du 2026-08-27 retirant la messagerie interne du MVP (D-030, cf. `docs/03-mvp.md`). Il sert de référence directe pour écrire le schéma Prisma en Phase 10.

## 1. Objectif de la phase

Définir les entités, leurs champs, leurs relations, les énumérations de statuts, et les règles d'intégrité — suffisamment précisément pour générer le schéma Prisma sans ambiguïté, et pour que la Phase 7 (Sécurité) puisse raisonner sur les données sensibles.

## 2. Vue d'ensemble des entités (périmètre MVP)

```
Region 1─N Department 1─N City                       (référentiel géographique, D27)
                             │
User (compte, auth) 1─1 Structure ──N─1── City (siège)
                          │
                          │ 1─N
                          ▼
                    MissionListing ──N─1── City (zone d'intervention)
                          │        └──N─M── Theme (taxonomie)
                          │        └──N─M── Audience (taxonomie)
                          │ 1─N
                          ▼
                    ContactRequest ──N─1── Structure (Organisateur, émetteur)

Report (signalement) ──N─1 User (auteur du signalement)
                       └─N─1 (contenu signalé : Structure | MissionListing, cf. §4.1)

AdminAction (journal d'audit) ──N─1 User (admin auteur)
                                └─N─1 (cible : User | Structure | MissionListing | Report | Theme | Audience)

Notification ──N─1 User (destinataire)
```

Note : `User` porte l'authentification et le rôle (`INTERVENANT` / `ORGANISATEUR` / `ADMIN`) ; `Structure` porte les informations métier de profil, en relation 1-1 avec `User` pour les rôles `INTERVENANT`/`ORGANISATEUR`. Un `User` de rôle `ADMIN` n'a pas de `Structure` associée (cf. décision D26). **`Conversation`/`Message` ne font pas partie du modèle MVP** — remplacés par `ContactRequest` (cf. D30) ; leur réintroduction est prévue pour l'itération "messagerie" post-MVP, sans remise en cause du reste du schéma.

## 3. Entités et champs

### 3.1 `User`
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| email | string, unique | |
| passwordHash | string, nullable | null si créé uniquement via Google OAuth |
| googleId | string, nullable, unique | présent si compte lié à Google (D14) |
| role | enum `INTERVENANT` \| `ORGANISATEUR` \| `ADMIN` | fixé à l'inscription, non modifiable (cf. D7) |
| accountStatus | enum `EN_ATTENTE` \| `ACTIF` \| `REJETE` \| `SUSPENDU` \| `ANONYMISE` | cf. §5 |
| rejectionReason | string, nullable | motif si `REJETE` |
| createdAt / updatedAt | datetime | |
| anonymizedAt | datetime, nullable | rempli lors de la suppression de compte (D12) |

### 3.2 `Structure`
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| userId | UUID, unique | FK → `User` (relation 1-1) |
| name | string | raison sociale / nom de la structure |
| description | text | |
| logoUrl | string, nullable | stockage S3-compatible (Phase 5 §3.5) |
| website | string, nullable | |
| contactEmail | string | email de contact utilisé pour transmettre les `ContactRequest` (D30) — jamais exposé publiquement, peut différer de `User.email` |
| cityId | UUID | FK → `City` (référentiel structuré, D27) |
| structureKind | enum `INTERVENANT` \| `ORGANISATEUR` | dénormalisé depuis `User.role` pour simplifier les requêtes de recherche (cohérence garantie par contrainte applicative) |
| createdAt / updatedAt | datetime | |

### 3.3 `MissionListing` (fiche mission — Intervenant uniquement)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| structureId | UUID | FK → `Structure` (doit être `structureKind = INTERVENANT`) |
| title | string | |
| description | text | |
| format | enum `PRESENTIEL` \| `DISTANCIEL` \| `HYBRIDE` | |
| cityId | UUID | FK → `City` — zone d'intervention (peut différer du siège de la structure) |
| budgetIndicative | string, nullable | texte libre volontairement (fourchette, "sur devis"...) plutôt qu'un nombre strict |
| availabilityNote | text, nullable | disponibilité en texte libre au MVP (pas de calendrier structuré, hors périmètre Phase 3) |
| status | enum `BROUILLON` \| `PUBLIEE` \| `DEPUBLIEE` | |
| publishedAt | datetime, nullable | |
| createdAt / updatedAt | datetime | |

Relations N-N :
- `MissionListing` ↔ `Theme` (table de jointure `MissionListingTheme`)
- `MissionListing` ↔ `Audience` (table de jointure `MissionListingAudience`)

### 3.4 `Theme` et `Audience` (taxonomie fermée, D10)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| label | string, unique | |
| active | boolean, default true | désactivation plutôt que suppression si déjà utilisé (cf. Phase 4 §3.5) |
| createdAt / updatedAt | datetime | |

### 3.5 `Region`, `Department`, `City` (référentiel géographique — D27)
| Entité | Champs clés | Notes |
|---|---|---|
| `Region` | id, code (code INSEE région), name | |
| `Department` | id, code (code INSEE département), name, regionId (FK) | |
| `City` | id, inseeCode, postalCode, name, departmentId (FK) | source : référentiel officiel (ex. API Géo / base officielle des codes postaux), chargé en base au déploiement initial et maintenu comme donnée de référence (pas de CRUD utilisateur) |

Ce référentiel remplace les champs texte libre `region`/`department`/`city` initialement envisagés. Il alimente les filtres de recherche (Phase 2 §4.3) et les champs de localisation de `Structure` et `MissionListing`.

### 3.6 `ContactRequest` (formulaire de contact — remplace la messagerie au MVP, D30)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| missionListingId | UUID, nullable | FK → `MissionListing` (contexte d'origine, nul si contact direct depuis un profil) |
| intervenantStructureId | UUID | FK → `Structure`, destinataire |
| organisateurStructureId | UUID | FK → `Structure`, émetteur |
| message | text | |
| status | enum `ENVOYE` \| `ECHEC_ENVOI` | résultat de l'envoi email |
| emailSentAt | datetime, nullable | |
| createdAt | datetime | |

Pas de fil de discussion : chaque `ContactRequest` est un envoi ponctuel, transmis par email à `Structure.contactEmail` de l'Intervenant. Limitation anti-spam (throttling) gérée au niveau applicatif (Phase 7), pas dans le modèle de données.

### 3.7 `Report` (signalement)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| authorUserId | UUID | FK → `User` |
| targetType | enum `STRUCTURE` \| `MISSION_LISTING` | référence polymorphe (cf. §4.1) — `MESSAGE` retiré du MVP avec la messagerie |
| targetId | UUID | |
| reason | text | |
| status | enum `OUVERT` \| `TRAITE_IGNORE` \| `TRAITE_ACTION` | |
| resolvedByUserId | UUID, nullable | FK → `User` (admin) |
| resolutionNote | text, nullable | |
| createdAt / resolvedAt | datetime | |

### 3.8 `AdminAction` (journal d'audit — obligatoire, cf. Phase 2 §5)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| adminUserId | UUID | FK → `User` |
| actionType | enum `VALIDATION_INSCRIPTION` \| `REJET_INSCRIPTION` \| `SUSPENSION_COMPTE` \| `REACTIVATION_COMPTE` \| `EDITION_COMPTE` \| `EDITION_FICHE` \| `TRAITEMENT_SIGNALEMENT` \| `GESTION_TAXONOMIE` | |
| targetType | enum `USER` \| `STRUCTURE` \| `MISSION_LISTING` \| `REPORT` \| `THEME` \| `AUDIENCE` | |
| targetId | UUID | |
| justification | text | obligatoire (cf. Phase 2 §5, Phase 7) |
| createdAt | datetime | immuable, jamais modifié/supprimé |

### 3.9 `Notification`
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → `User`, destinataire |
| type | enum `INSCRIPTION_VALIDEE` \| `INSCRIPTION_REJETEE` \| `NOUVELLE_DEMANDE_CONTACT` \| `SIGNALEMENT_TRAITE` | |
| payload | JSON | données contextuelles (ex. id de `ContactRequest`) pour construire le lien/texte |
| readAt | datetime, nullable | |
| emailSentAt | datetime, nullable | traçabilité de l'envoi email (D11) |
| createdAt | datetime | |

## 4. Points de modélisation à clarifier

### 4.1 Référence polymorphe (`Report.targetId`, `AdminAction.targetId`)
Pas de clé étrangère typée native en PostgreSQL/Prisma pour une relation polymorphe simple. **Décision D29 : `targetType` + `targetId`, sans FK native, intégrité garantie au niveau applicatif (Prisma + tests).**

### 4.2 Anonymisation (D12)
À la suppression de compte : `User.email`, `passwordHash`, `googleId` sont vidés/remplacés par des valeurs anonymisées ; `Structure.name/description/logoUrl/contactEmail/website` sont anonymisés ; les `MissionListing` associées passent en `DEPUBLIEE`. Les `ContactRequest` déjà envoyées restent en base à des fins de traçabilité anti-abus (aucune donnée personnelle supplémentaire au-delà des FK, déjà couvertes par l'anonymisation de `Structure`). Le détail complet (durées de conservation, base légale) est traité en Phase 7.

## 5. Diagramme d'états — `User.accountStatus`

```
EN_ATTENTE ──(validation admin)──> ACTIF ──(suspension admin)──> SUSPENDU ──(réactivation admin)──> ACTIF
    │                                │                                                                  
    └──(rejet admin)──> REJETE       └──(suppression par l'utilisateur)──> ANONYMISE
                            │
                            └──(correction + resoumission)──> EN_ATTENTE
```

## 6. Diagramme d'états — `MissionListing.status`

```
BROUILLON ──(publier)──> PUBLIEE ──(dépublier)──> DEPUBLIEE ──(republier)──> PUBLIEE
```

## 7. Décisions — validées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D26 | `User` (auth, rôle, statut) **séparé** de `Structure` (profil métier), relation 1-1. |
| D27 | **Référentiel géographique structuré** (`Region`/`Department`/`City`), pas de texte libre. |
| D28 | Sans objet au MVP — la notion de conversation est retirée (cf. D30) ; à rouvrir lors de l'itération "messagerie". |
| D29 | Références polymorphes en `targetType` + `targetId`, sans FK native. |
| D30 *(amendement)* | Retrait de `Conversation`/`Message` du MVP, remplacés par `ContactRequest` (contact par email simple, cf. §3.6). |

## 8. Risques identifiés (niveau modèle de données)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Référentiel géographique structuré (D27) nécessite une source de données fiable et sa maintenance (communes qui fusionnent, codes postaux) | Faible (référentiel officiel peu volatile) | Faible | Utiliser une source officielle (API Géo du gouvernement français ou export équivalent), mise à jour ponctuelle, pas de synchronisation temps réel nécessaire au MVP |
| Références polymorphes sans FK native (D29) risquent des données orphelines si mal gérées applicativement | Faible avec Prisma + tests | Moyen | Couvrir par des tests d'intégration sur la création/suppression des entités concernées (Phase 10) |
| Suppression "en cascade" mal maîtrisée (ex. suppression d'un `Theme` utilisé par des fiches publiées) | Faible (désactivation plutôt que suppression, cf. §3.4) | Moyen | Contrainte applicative : un `Theme`/`Audience` inactif reste affiché sur les fiches existantes mais n'est plus sélectionnable pour une nouvelle fiche |
| Retrait de la messagerie (D30) laisse `ContactRequest` sans garde-fou anti-spam si non implémenté avec rigueur | Moyenne | Moyen | Throttling applicatif obligatoire dès la Phase 10 (ex. limite par IP/compte/fenêtre de temps), à spécifier en Phase 7 |

## 9. Alternatives envisagées et écartées

- **Modèle NoSQL/document (ex. MongoDB)** : écarté — le domaine est fortement relationnel (comptes, fiches, modération, taxonomie, référentiel géographique), PostgreSQL relationnel est plus adapté et cohérent avec la Phase 5.
- **Table `User` unique sans entité `Structure` séparée** : écartée (D26) — moins propre pour l'anonymisation ciblée et l'évolution du profil métier.
- **Texte libre pour la géographie** : écarté au profit du référentiel structuré (D27), sur décision explicite de l'utilisateur — meilleure fiabilité du filtrage dès le départ.
- **Conserver `Conversation`/`Message` dans le schéma MVP mais vides d'usage** : écarté — inutile de porter la complexité d'un modèle non utilisé ; `ContactRequest` est plus simple et suffisant pour le besoin réel du MVP (D30).

## 10. Critères de validation de la phase

- [x] D26 à D30 tranchées.
- [x] Entités et champs jugés complets pour couvrir le périmètre MVP amendé (Phase 3).
- [x] Diagrammes d'état validés.
- [x] Points de modélisation (§4) jugés suffisamment clairs pour écrire le schéma Prisma en Phase 10.

**Phase 6 validée le 2026-08-27.** → Passage à la Phase 7 (Sécurité).
