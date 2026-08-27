# Phase 6 — Modèle de données

Statut : 🟡 **En attente de validation**

Ce document dérive directement des Phases 1 à 5 (rôles, statuts, fiches mission, messagerie, modération, taxonomie fermée, auth email + Google OAuth, Prisma/PostgreSQL). Il sert de référence directe pour écrire le schéma Prisma en Phase 10.

## 1. Objectif de la phase

Définir les entités, leurs champs, leurs relations, les énumérations de statuts, et les règles d'intégrité — suffisamment précisément pour générer le schéma Prisma sans ambiguïté, et pour que la Phase 7 (Sécurité) puisse raisonner sur les données sensibles.

## 2. Vue d'ensemble des entités

```
User (compte, auth) 1─1 Structure (profil Intervenant ou Organisateur)
                          │
                          │ 1─N
                          ▼
                    MissionListing (fiche mission) ──N─M── Theme (taxonomie)
                          │                          └──N─M── Audience (taxonomie)
                          │ 1─N
                          ▼
                    Conversation ──N──1 Structure (Organisateur, initiateur)
                          │ 1─N
                          ▼
                       Message

Report (signalement) ──N─1 User (auteur du signalement)
                       └─N─1 (contenu signalé : Structure | MissionListing | Message, cf. §4.7)

AdminAction (journal d'audit) ──N─1 User (admin auteur)
                                └─N─1 (cible : Structure | MissionListing | User | Report)
```

Note : `User` porte l'authentification et le rôle (`INTERVENANT` / `ORGANISATEUR` / `ADMIN`) ; `Structure` porte les informations métier de profil (Intervenant ou Organisateur), en relation 1-1 avec `User` pour les rôles `INTERVENANT`/`ORGANISATEUR`. Un `User` de rôle `ADMIN` n'a pas de `Structure` associée (cf. décision D26).

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
| contactEmail | string | peut différer de `User.email` (email de contact public vs identifiant de connexion) |
| region | string | cf. décision D27 (référentiel géographique) |
| department | string, nullable | |
| city | string, nullable | |
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
| region / department / city | string | zone d'intervention, cf. D27 (peut différer du siège de la structure) |
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

### 3.5 `Conversation`
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| missionListingId | UUID, nullable | FK → `MissionListing` (contexte d'origine, peut être nul si contact direct vers un profil) |
| intervenantStructureId | UUID | FK → `Structure` |
| organisateurStructureId | UUID | FK → `Structure` |
| createdAt / updatedAt | datetime | |

Contrainte : unicité applicative recommandée sur `(missionListingId, organisateurStructureId)` pour éviter des conversations dupliquées sur la même fiche par le même Organisateur (à confirmer, cf. décision D28).

### 3.6 `Message`
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| conversationId | UUID | FK → `Conversation` |
| authorUserId | UUID | FK → `User` |
| body | text | |
| readAt | datetime, nullable | |
| createdAt | datetime | |

### 3.7 `Report` (signalement)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | PK |
| authorUserId | UUID | FK → `User` |
| targetType | enum `STRUCTURE` \| `MISSION_LISTING` \| `MESSAGE` | |
| targetId | UUID | référence polymorphe (cf. §4.7 pour le choix de modélisation) |
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
| type | enum `INSCRIPTION_VALIDEE` \| `INSCRIPTION_REJETEE` \| `NOUVEAU_MESSAGE` \| `NOUVELLE_CONVERSATION` \| `SIGNALEMENT_TRAITE` | |
| payload | JSON | données contextuelles (ex. id de conversation) pour construire le lien/texte |
| readAt | datetime, nullable | |
| emailSentAt | datetime, nullable | traçabilité de l'envoi email (D11) |
| createdAt | datetime | |

## 4. Points de modélisation à clarifier

### 4.1 Référence polymorphe (`Report.targetId`, `AdminAction.targetId`)
Pas de clé étrangère typée native en PostgreSQL/Prisma pour une relation polymorphe simple. Deux approches possibles — cf. décision D29.

### 4.2 Référentiel géographique
Texte libre normalisé (region/department/city en string) vs référentiel structuré (table `Commune`/`Department`/`Region` avec codes INSEE, permettant un filtrage fiable et une future carte interactive). Cf. décision D27.

### 4.3 Anonymisation (D12)
À la suppression de compte : `User.email`, `passwordHash`, `googleId` sont vidés/remplacés par des valeurs anonymisées ; `Structure.name/description/logoUrl/contactEmail/website` sont anonymisés ; les `MissionListing` associées passent en `DEPUBLIEE` ; les `Message` restent techniquement en base (nécessaires à l'intégrité des conversations pour l'autre participant) mais l'auteur n'est plus identifiable nommément dans l'UI (affichage "Compte supprimé"). Le détail complet (durées de conservation, base légale) est traité en Phase 7.

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

## 7. Décisions à prendre pour valider cette phase

### D26 — Séparation `User` / `Structure`
- **Option A (retenue par défaut, cf. §2)** : `User` (auth, rôle, statut) séparé de `Structure` (données métier de profil), en 1-1 pour Intervenant/Organisateur. Permet de garder l'authentification simple et indépendante des évolutions du profil métier.
- **Option B** : tout fusionner dans une seule table `User` avec des champs optionnels selon le rôle. Plus simple au tout début mais moins propre à mesure que le profil s'enrichit, et complique l'anonymisation ciblée (D12).

*Recommandation : Option A, déjà reflétée dans le schéma ci-dessus.*

### D27 — Référentiel géographique
- **Option A (recommandée MVP)** : champs texte libre normalisés (`region`, `department`, `city`) alimentés par une liste de suggestion côté formulaire (pas de table de référence stricte en base). Simple à mettre en place.
- **Option B** : référentiel structuré complet (table des régions/départements/communes françaises, éventuellement avec géocodage/coordonnées pour une future carte). Plus robuste et prêt pour des fonctionnalités futures (recherche par rayon, carte), mais plus de travail de mise en place au MVP.

### D28 — Unicité conversation par (fiche, Organisateur)
- Empêcher plusieurs conversations dupliquées entre le même Organisateur et la même fiche mission (recommandé, évite la confusion dans la messagerie), ou autoriser plusieurs conversations sur une même fiche (ex. pour des besoins différents) ?

### D29 — Modélisation des références polymorphes (`Report`, `AdminAction`)
- **Option A (recommandée)** : `targetType` (enum) + `targetId` (UUID) sans contrainte FK native, intégrité garantie au niveau applicatif (Prisma). Simple, flexible, standard pour ce genre de cas (signalement/audit multi-cibles).
- **Option B** : une table de jointure par type de cible (ex. `ReportOnStructure`, `ReportOnMissionListing`...). Intégrité référentielle garantie par la base, mais duplique la structure pour chaque type cible.

## 8. Risques identifiés (niveau modèle de données)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Référentiel géographique en texte libre (D27 option A) produit des variantes incohérentes (ex. "Île-de-France" vs "ile de france") et dégrade le filtrage | Moyenne | Moyen | Autocomplétion/suggestion contrôlée côté formulaire dès le MVP, même sans table de référence stricte en base |
| Références polymorphes sans FK native (D29 option A) risquent des données orphelines si mal gérées applicativement | Faible avec Prisma + tests | Moyen | Couvrir par des tests d'intégration sur la création/suppression des entités concernées (Phase 10) |
| Suppression "en cascade" mal maîtrisée (ex. suppression d'un `Theme` utilisé par des fiches publiées) | Faible (désactivation plutôt que suppression, cf. §3.4) | Moyen | Contrainte applicative : un `Theme`/`Audience` inactif reste affiché sur les fiches existantes mais n'est plus sélectionnable pour une nouvelle fiche |

## 9. Alternatives envisagées et écartées

- **Modèle NoSQL/document (ex. MongoDB)** : écarté — le domaine est fortement relationnel (comptes, fiches, conversations, modération, taxonomie), PostgreSQL relationnel est plus adapté et cohérent avec la Phase 5.
- **Table `User` unique sans entité `Structure` séparée** : écartée (cf. D26 recommandation) — moins propre pour l'anonymisation ciblée et l'évolution du profil métier.

## 10. Critères de validation de la phase

- [ ] D26 à D29 tranchées.
- [ ] Entités et champs jugés complets pour couvrir le périmètre MVP (Phase 3).
- [ ] Diagrammes d'état validés.
- [ ] Points de modélisation (§4) jugés suffisamment clairs pour écrire le schéma Prisma en Phase 10.
