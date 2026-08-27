# Phase 2 — Spécifications fonctionnelles

Statut : ✅ **Validée** (amendée le 2026-08-27)

> **Amendement du 2026-08-27 (pivot de modèle)** : ce document est réécrit pour refléter le modèle **annuaire d'activités** — l'Organisateur publie ses propres activités et déclare pour chacune au moins un Intervenant (fiche sans compte, modérée par l'admin). Il n'y a plus que deux rôles de compte : **Organisateur** et **Administrateur**. Voir `docs/01-cadrage-produit.md` et `docs/DECISIONS.md` (D-042 à D-045).

Ce document s'appuie sur les décisions validées en Phase 1 (`docs/DECISIONS.md`, D1-D6, révisées) : annuaire d'activités, gratuit au lancement, vérification manuelle + espace admin (comptes Organisateur et fiches Intervenant), portée région pilote avec filtre géographique, contact via l'Organisateur.

## 1. Objectif de la phase

Décrire précisément les rôles, les parcours, les fonctionnalités et les règles de gestion — suffisamment pour que la Phase 3 (MVP) puisse trancher ce qui est livré en premier, et pour que la Phase 6 (modèle de données) puisse être dérivée directement de ce document.

## 2. Rôles et permissions

| Rôle | Description | Peut faire |
|---|---|---|
| **Visiteur** (non connecté) | Toute personne consultant le site sans compte | Consulter l'annuaire public des activités publiées (données non sensibles), consulter la présentation du service, contacter un Organisateur au sujet d'une activité (formulaire, sans compte requis), créer un compte Organisateur |
| **Organisateur** | Structure qui organise et publie des activités pédagogiques | Créer/éditer son profil structure, gérer un carnet d'Intervenants (fiches réutilisables), créer/éditer/dépublier ses activités (chacune déclarant au moins un Intervenant validé), recevoir les demandes de contact, signaler un abus |
| **Administrateur** | Équipe interne de modération/gestion (cf. D3) | Valider/rejeter les inscriptions de comptes Organisateur, valider/rejeter les fiches Intervenant créées par les Organisateurs, suspendre/réactiver/supprimer un compte, éditer une activité/fiche Intervenant/profil (au nom de l'utilisateur), traiter les signalements, consulter les statistiques d'usage, gérer les comptes admin (selon sous-rôles, cf. décision D9) |

## 3. Parcours utilisateurs (flows principaux)

### 3.1 Inscription et vérification (Organisateur)
1. Le visiteur crée un compte Organisateur (email + mot de passe, ou SSO — cf. Phase Architecture).
2. Il renseigne les informations de sa structure (nom, description, zone géographique, contact).
3. Le compte est créé avec un statut **"en attente de validation"** : le profil n'est pas visible publiquement, mais l'utilisateur peut déjà compléter son profil et préparer son carnet d'Intervenants.
4. Un Administrateur reçoit une notification, consulte le dossier, et **valide** ou **rejette** (avec motif) l'inscription.
5. Si validé → le compte devient actif (statut **"actif"**), notification à l'utilisateur.
6. Si rejeté → notification avec motif, possibilité de corriger et de resoumettre.

### 3.2 Gestion du carnet d'Intervenants (Organisateur)
1. Un Organisateur au statut "actif" crée une fiche Intervenant : nom, structure/organisation le cas échéant, description, contact (usage interne, cf. Phase 7).
2. La fiche est créée avec un statut **"en attente de validation"**.
3. Un Administrateur valide ou rejette (avec motif) la fiche.
4. Une fois **validée**, la fiche est réutilisable par l'Organisateur sur autant d'activités qu'il le souhaite, sans nouvelle validation à chaque réutilisation.
5. L'Organisateur peut éditer une fiche Intervenant existante (repasse en attente de validation si les informations changent significativement — règle précise à Phase 6) ou la désactiver.

### 3.3 Publication d'une activité (Organisateur)
1. Un Organisateur au statut "actif" crée une activité : titre, description, thématique(s), public(s) visé(s) (niveau scolaire/âge), format (présentiel/distanciel/hybride), zone géographique, budget indicatif (optionnel), disponibilités, et **au moins un Intervenant** choisi dans son carnet (ou créé à la volée, cf. 3.2).
2. La publication n'est possible que si **tous les Intervenants déclarés sur l'activité sont au statut "validé"** — sinon l'activité reste en brouillon avec un message explicite.
3. Une fois ces conditions réunies, l'activité est publiée directement (pas de re-validation admin de l'activité elle-même — seuls les comptes et les fiches Intervenant sont vérifiés en amont) **sauf si un signalement est reçu ensuite**.
4. L'Organisateur peut modifier, dépublier ou archiver son activité à tout moment.

### 3.4 Recherche et contact (Visiteur)
1. Le Visiteur (avec ou sans compte) recherche via mots-clés et filtres (thématique, public, zone géographique, format).
2. Il consulte une fiche activité : description, Intervenant(s) déclaré(s) (nom, présentation — sans coordonnées directes), profil sommaire de l'Organisateur.
3. Il initie un contact via un **formulaire simple** adressé à l'Organisateur (pas de compte requis pour contacter) : message + email de réponse.
4. L'Organisateur reçoit une notification et l'email correspondant, et répond directement par email (hors plateforme, cf. Phase 3 amendement messagerie).

### 3.5 Clôture / avis (optionnel MVP — cf. section 8, D8)
- Reporté après le MVP (pas de messagerie ni de fil de discussion à clôturer au MVP — le contact est un envoi ponctuel).

### 3.6 Modération et administration
1. Un utilisateur signale une activité ou une fiche Intervenant abusive.
2. L'Administrateur consulte la file de signalements, peut : ignorer, avertir l'auteur, dépublier le contenu, suspendre le compte Organisateur concerné.
3. L'Administrateur peut à tout moment rechercher un compte, une activité ou une fiche Intervenant et l'éditer/suspendre directement (hors signalement), avec traçabilité de l'action (qui, quand, quoi — cf. Phase Sécurité pour l'audit trail).

## 4. Fonctionnalités détaillées par domaine

### 4.1 Comptes & profils
- Création de compte Organisateur uniquement (plus de distinction de type de compte — un seul rôle "métier").
- Informations structure : raison sociale, description, logo/image, zone géographique, coordonnées, site web (optionnel), personne de contact.
- Statuts de compte : `en_attente`, `actif`, `rejete`, `suspendu`, `supprime`.
- Modification du profil, désactivation volontaire du compte par l'utilisateur.

### 4.2 Intervenants (fiches gérées par l'Organisateur)
- CRUD complet côté Organisateur, restreint à ses propres fiches (pas de partage entre Organisateurs au MVP).
- Champs a minima : nom, structure/organisation (optionnel), description, contact (interne, non public — cf. Phase 7).
- Statuts : `en_attente`, `validee`, `rejetee`, `desactivee`.
- Une activité ne peut afficher/publier qu'un Intervenant au statut `validee`.

### 4.3 Activités (remplace "fiches mission")
- CRUD complet côté Organisateur, restreint à ses propres activités.
- Champs a minima : titre, description, thématique(s) (taxonomie à définir), public(s)/niveau(x), format, zone géographique, disponibilité, budget indicatif (optionnel), un ou plusieurs Intervenants associés (validés).
- Statuts : `brouillon`, `publiee`, `depubliee`/`archivee`.

### 4.4 Recherche & filtres
- Recherche texte libre + filtres combinables (thématique, public, zone, format, disponibilité) sur les activités publiées.
- Tri (pertinence, proximité géographique, date de publication).
- Résultats accessibles sans compte (annuaire public en lecture, D13).

### 4.5 Formulaire de contact (remplace la messagerie interne au MVP)
- Formulaire sur une fiche activité : nom/email du visiteur, message → envoyé par email à l'Organisateur.
- Pas de fil de discussion ni de compte requis pour l'émetteur.
- Signalement possible du contenu d'une activité (pas d'un message, puisqu'il n'y a pas de messagerie).
- Limitation anti-spam (throttling, cf. Phase 7).

### 4.6 Notifications
- Événements déclencheurs : validation/rejet d'inscription Organisateur, validation/rejet de fiche Intervenant, nouvelle demande de contact reçue, signalement traité.
- Canaux envisagés : in-app (obligatoire), email (recommandé). Push mobile hors périmètre (pas d'app native, Phase 1 §5).

### 4.7 Avis / réputation (optionnel MVP)
- Reporté après le MVP (D8, inchangé).

### 4.8 Administration
- Back-office listant les comptes Organisateur en attente de validation, avec dossier consultable.
- Back-office listant les fiches Intervenant en attente de validation, avec dossier consultable.
- File de signalements avec actions (ignorer/avertir/dépublier/suspendre).
- Recherche globale (comptes, activités, fiches Intervenant).
- Édition directe d'un compte/activité/fiche Intervenant par un admin, avec justification obligatoire et traçabilité.
- Gestion des comptes administrateurs eux-mêmes (création par un admin existant, pas d'auto-inscription admin).

## 5. Règles de gestion transverses

- Un compte Organisateur non "actif" ne peut ni publier d'activité, ni créer de fiche Intervenant, ni apparaître dans les résultats de recherche.
- Une activité ne peut être publiée que si l'Organisateur est `actif` **et** que tous ses Intervenants déclarés sont `validee`.
- Un compte suspendu perd l'accès à la publication, mais ses données restent consultables par l'admin (traçabilité, litiges).
- Toute action admin significative (validation, rejet, suspension, édition au nom d'un utilisateur, traitement de signalement) est journalisée (qui, quoi, quand) — prérequis pour la Phase Sécurité.
- La suppression de compte à la demande de l'utilisateur suit un processus RGPD (anonymisation, cf. décision D12 en section 8 et détails en Phase Sécurité).

## 6. Hors périmètre fonctionnel (confirmé, cf. Phase 1 §5)

- Paiement en ligne, facturation.
- Signature électronique.
- Vérification automatisée d'habilitations officielles.
- Messagerie interne (reportée, cf. Phase 3 amendement).
- Multi-langue.

## 7. Risques identifiés (niveau fonctionnel)

| Risque | Probabilité | Impact | Mitigation envisagée |
|---|---|---|---|
| Annuaire public en lecture libre expose des données à du scraping/spam | Moyenne | Moyen | Ne publier que des informations non sensibles sans compte ; coordonnées de l'Organisateur jamais exposées directement, contact via formulaire uniquement |
| Volume de validations manuelles (comptes + fiches Intervenant, D3) devient un goulot d'étranglement à mesure que la plateforme grandit | Moyenne | Moyen | Prévoir des indicateurs de délai de traitement dès le MVP ; SLA interne informel au départ |
| Un Organisateur déclare un Intervenant fictif ou trompeur pour publier plus vite | Faible à moyenne | Moyen | Validation admin obligatoire de chaque fiche Intervenant avant utilisation (cf. 3.2), signalement a posteriori possible |
| Confusion pour les visiteurs sur qui répond au contact (l'Organisateur, pas l'Intervenant) | Moyenne | Faible | Libellé explicite sur le formulaire de contact ("Votre message sera envoyé à [Organisateur]") |

## 8. Décisions — validées le 2026-08-27, révisées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D7 | *(obsolète)* Un seul rôle de compte "métier" (Organisateur) — plus de cumul à trancher. |
| D8 | **Reporté après le MVP.** Pas d'avis/réputation au lancement. |
| D9 | **Rôle admin unique** au MVP (pas de distinction Modérateur/Super-admin). |
| D10 | **Liste fermée** de thématiques/publics, gérée par les administrateurs. |
| D11 | **In-app + email** dès le MVP. Implique un service d'envoi d'email transactionnel (cf. Phase 5 — Architecture). |
| D12 | **Anonymisation** des données personnelles à la suppression, avec conservation des métadonnées de modération (signalements, actions admin) à des fins de traçabilité/litiges. À détailler en Phase 7 — Sécurité. |
| D13 | **Annuaire public**, consultable sans compte — porte désormais sur les **activités** publiées. Seules les données non sensibles sont exposées (pas de coordonnées directes de l'Organisateur) ; le contact passe par le formulaire (D30, D-042). Seuls les comptes Organisateur **connectés et validés** peuvent créer une activité ou une fiche Intervenant — les visiteurs sont strictement en lecture + contact. |
| D42 | **Modèle annuaire d'activités** (détail en `docs/01-cadrage-produit.md` D1 révisée). |
| D43 | **Deux rôles de compte seulement : Organisateur et Administrateur.** |
| D44 | **Fiches Intervenant modérées par l'admin**, réutilisables une fois validées (cf. §3.2). |
| D45 | **Règle de publication d'activité** : nécessite l'Organisateur `actif` et tous les Intervenants déclarés `validee`. |

## 9. Alternatives envisagées et écartées

- **Validation 100% automatique des inscriptions/fiches Intervenant** : écartée à ce stade — contredit la décision D3 (vérification manuelle), qui répond à un besoin de confiance explicitement demandé.
- **Fiches Intervenant partagées/mutualisées entre Organisateurs** : écartée au MVP — plus simple de garder chaque fiche scopée à l'Organisateur qui l'a créée (pas de déduplication/fusion à gérer) ; réévaluable en évolution si des doublons deviennent gênants.
- **Contact direct vers l'Intervenant (coordonnées exposées)** : écartée — l'Intervenant n'a pas de compte pour gérer ce contact, et l'exposition de coordonnées non vérifiées poserait un risque de spam/qualité (cf. §7).

## 10. Critères de validation de la phase

- [x] D7 à D13 tranchés (D7 devenu obsolète suite au pivot).
- [x] D42 à D45 tranchées (amendement pivot).
- [x] Rôles, permissions et parcours jugés complets et fidèles au nouveau modèle.
- [x] Règles de gestion validées (statuts de compte, de fiche Intervenant, d'activité, journalisation admin).
- [x] Risques jugés complets à ce stade.

**Phase 2 validée le 2026-08-27, amendée le 2026-08-27.** → Passage à la Phase 3 (Définition du MVP), également amendée.
