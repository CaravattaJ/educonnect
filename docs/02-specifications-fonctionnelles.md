# Phase 2 — Spécifications fonctionnelles

Statut : ✅ **Validée**

Ce document s'appuie sur les décisions validées en Phase 1 (`docs/DECISIONS.md`, D1-D6) : modèle annuaire + messagerie, gratuit au lancement, vérification manuelle + espace admin, portée région pilote avec filtre géographique, messagerie interne uniquement.

## 1. Objectif de la phase

Décrire précisément les rôles, les parcours, les fonctionnalités et les règles de gestion — suffisamment pour que la Phase 3 (MVP) puisse trancher ce qui est livré en premier, et pour que la Phase 6 (modèle de données) puisse être dérivée directement de ce document.

## 2. Rôles et permissions

| Rôle | Description | Peut faire |
|---|---|---|
| **Visiteur** (non connecté) | Toute personne consultant le site sans compte | Consulter l'annuaire public des Intervenants/fiches (données non sensibles), consulter la présentation du service, créer un compte |
| **Intervenant** | Structure proposant des interventions pédagogiques | Créer/éditer son profil structure, créer/éditer/dépublier ses fiches mission (offres), recevoir et répondre aux demandes de contact, consulter les profils Organisateurs contactés, gérer sa messagerie, signaler un abus |
| **Organisateur** | Structure recherchant une intervention | Créer/éditer son profil structure, rechercher/filtrer les Intervenants et fiches mission, contacter un Intervenant (ouverture de conversation), gérer sa messagerie, signaler un abus, (optionnel MVP) laisser un avis après intervention |
| **Administrateur** | Équipe interne de modération/gestion (cf. D3) | Valider/rejeter les inscriptions de structures, suspendre/réactiver/supprimer un compte, éditer une fiche mission ou un profil (au nom de l'utilisateur), traiter les signalements, consulter les statistiques d'usage, gérer les comptes admin (selon sous-rôles, cf. décision D9) |

**Décision ouverte D7** — cf. section 8.

## 3. Parcours utilisateurs (flows principaux)

### 3.1 Inscription et vérification (Intervenant ou Organisateur)
1. Le visiteur choisit son type de structure (Intervenant / Organisateur) et crée un compte (email + mot de passe, ou SSO — cf. Phase Architecture).
2. Il renseigne les informations de la structure (nom, description, zone géographique, contact, éventuellement SIRET/n° d'agrément).
3. Le compte est créé avec un statut **"en attente de validation"** : le profil n'est pas visible publiquement, mais l'utilisateur peut déjà compléter son profil.
4. Un Administrateur reçoit une notification, consulte le dossier, et **valide** ou **rejette** (avec motif) l'inscription.
5. Si validé → le profil devient visible/publiable (statut **"actif"**), notification à l'utilisateur.
6. Si rejeté → notification avec motif, possibilité de corriger et de resoumettre.

### 3.2 Publication d'une fiche mission (Intervenant)
1. Un Intervenant au statut "actif" crée une fiche mission : titre, description, thématique(s), public(s) visé(s) (niveau scolaire/âge), format (durée, à distance/présentiel), zone géographique d'intervention, budget indicatif (optionnel), disponibilités.
2. La fiche est publiée directement (pas de re-validation admin systématique par fiche — seule l'inscription initiale de la structure est vérifiée) **sauf si un signalement est reçu ensuite**.
3. L'Intervenant peut modifier, dépublier ou archiver sa fiche à tout moment.

*Décision ouverte D10 (contenu exact des champs) — cf. section 8. Décision ouverte : faut-il une re-modération par fiche ou seulement à l'inscription ? Recommandation : modération a posteriori (sur signalement) pour ne pas ralentir la publication, cohérent avec D3 qui porte sur la structure et non chaque contenu.*

### 3.3 Recherche et mise en relation (Organisateur)
1. L'Organisateur recherche via mots-clés et filtres (thématique, public, zone géographique, format, disponibilité).
2. Il consulte une fiche mission / un profil Intervenant.
3. Il initie un contact : ouverture d'une conversation dans la messagerie interne, avec un message initial et éventuellement le contexte (dates souhaitées, effectif, budget).
4. L'Intervenant reçoit une notification et répond dans la messagerie.
5. Les échanges suivants (organisation logistique, confirmation) se font dans la messagerie interne (cf. D5).

### 3.4 Clôture d'une mise en relation (optionnel MVP — cf. section 8, D8)
- Marquer une conversation comme "intervention réalisée" ?
- Laisser un avis/évaluation réciproque ?

### 3.5 Modération et administration
1. Un utilisateur signale une fiche, un profil ou un message abusif.
2. L'Administrateur consulte la file de signalements, peut : ignorer, avertir l'auteur, dépublier le contenu, suspendre le compte.
3. L'Administrateur peut à tout moment rechercher un compte ou une fiche et l'éditer/suspendre directement (hors signalement), avec traçabilité de l'action (qui, quand, quoi — cf. Phase Sécurité pour l'audit trail).

## 4. Fonctionnalités détaillées par domaine

### 4.1 Comptes & profils
- Création de compte par type de structure (Intervenant / Organisateur) — **un compte a un type unique** sauf décision contraire (D7).
- Informations structure : raison sociale, description, logo/image, zone(s) géographique(s), coordonnées, site web (optionnel), personnes de contact.
- Statuts de compte : `en_attente`, `actif`, `rejete`, `suspendu`, `supprime`.
- Modification du profil, désactivation volontaire du compte par l'utilisateur.

### 4.2 Fiches mission (offres d'intervention)
- CRUD complet côté Intervenant, restreint à ses propres fiches.
- Champs a minima : titre, description, thématique(s) (taxonomie à définir), public(s)/niveau(x), format, zone géographique, disponibilité, budget indicatif (optionnel).
- Statuts : `brouillon`, `publiee`, `depubliee`/`archivee`.

### 4.3 Recherche & filtres
- Recherche texte libre + filtres combinables (thématique, public, zone, format, disponibilité).
- Tri (pertinence, proximité géographique, date de publication).
- Résultats accessibles sans compte (annuaire public en lecture) — **à confirmer, impacte le SEO/visibilité vs. la confidentialité (cf. section 7 risques).**

### 4.4 Messagerie interne
- Conversation liée à une mise en relation entre un Intervenant et un Organisateur (éventuellement rattachée à une fiche mission).
- Envoi de messages texte, horodatage, indicateur lu/non lu.
- Signalement d'un message ou d'une conversation.
- Pas de pièce jointe au MVP (à réévaluer — risque de sécurité si upload non maîtrisé, cf. Phase Sécurité).

### 4.5 Notifications
- Événements déclencheurs : validation/rejet d'inscription, nouveau message, nouvelle demande de contact, signalement traité.
- Canaux envisagés : in-app (obligatoire), email (recommandé). Push mobile hors périmètre (pas d'app native, D. Phase 1 §5).

### 4.6 Avis / réputation (optionnel MVP)
- Possibilité pour l'Organisateur de noter/commenter un Intervenant après intervention.
- Risque d'abus (faux avis, avis négatifs non fondés) → nécessite modération (cf. section 7).

### 4.7 Administration
- Back-office listant les structures en attente de validation, avec dossier consultable.
- File de signalements avec actions (ignorer/avertir/dépublier/suspendre).
- Recherche globale (comptes, fiches).
- Édition directe d'un compte/fiche par un admin, avec justification obligatoire et traçabilité.
- Gestion des comptes administrateurs eux-mêmes (création par un admin existant, pas d'auto-inscription admin).

## 5. Règles de gestion transverses

- Un compte non "actif" ne peut ni publier de fiche, ni initier de contact, ni apparaître dans les résultats de recherche.
- Un compte suspendu perd l'accès à la messagerie et à la publication, mais ses données restent consultables par l'admin (traçabilité, litiges).
- Toute action admin significative (validation, rejet, suspension, édition au nom d'un utilisateur, traitement de signalement) est journalisée (qui, quoi, quand) — prérequis pour la Phase Sécurité.
- La suppression de compte à la demande de l'utilisateur suit un processus RGPD (anonymisation ou suppression réelle des données personnelles, cf. décision D12 en section 8 et détails en Phase Sécurité).

## 6. Hors périmètre fonctionnel (confirmé, cf. Phase 1 §5)

- Paiement en ligne, facturation.
- Signature électronique.
- Vérification automatisée d'habilitations officielles.
- Pièces jointes dans la messagerie (au MVP).
- Multi-langue.

## 7. Risques identifiés (niveau fonctionnel)

| Risque | Probabilité | Impact | Mitigation envisagée |
|---|---|---|---|
| Annuaire public en lecture libre expose des données de contact à du scraping/spam | Moyenne | Moyen | Ne publier que des informations non sensibles sans compte ; contact réel uniquement via messagerie interne après connexion |
| Avis/réputation détournés (diffamation, avis fantaisistes) | Moyenne | Moyen | Modération a posteriori, droit de réponse, avis liés à une conversation réelle uniquement (pas d'avis "à froid") |
| Volume de validations manuelles (D3) devient un goulot d'étranglement à mesure que la plateforme grandit | Moyenne | Moyen | Prévoir des indicateurs de délai de traitement dès le MVP ; SLA interne informel au départ |
| Ambiguïté sur le cumul de rôles (D7) bloque la conception du modèle de données | Élevée si non tranché | Élevé | Trancher D7 avant la Phase 3 |
| Absence de "clôture" formelle d'une mise en relation rend le suivi/statistiques difficile | Faible au MVP, plus gênant ensuite | Faible | Noter comme évolution possible (statut de conversation) sans bloquer le MVP |

## 8. Décisions — validées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D7 | **Un type par compte** (Option A, valeur par défaut retenue). Le retour utilisateur a surtout confirmé le modèle de permissions global (cf. D13 : visiteurs en lecture seule, seuls les comptes connectés **et validés** peuvent créer une fiche mission) sans trancher explicitement le cumul de rôles. Décision non contestée → on retient l'option recommandée ; à amender si besoin en Phase 3/6. |
| D8 | **Reporté après le MVP.** Pas d'avis/réputation au lancement. |
| D9 | **Rôle admin unique** au MVP (pas de distinction Modérateur/Super-admin). |
| D10 | **Liste fermée** de thématiques/publics, gérée par les administrateurs. |
| D11 | **In-app + email** dès le MVP. Implique un service d'envoi d'email transactionnel (cf. Phase 5 — Architecture). |
| D12 | **Anonymisation** des données personnelles à la suppression, avec conservation des métadonnées de modération (signalements, actions admin) à des fins de traçabilité/litiges. À détailler en Phase 7 — Sécurité. |
| D13 | **Annuaire public**, consultable sans compte. Seules les données non sensibles sont exposées (pas de coordonnées directes) ; le contact réel passe par la messagerie interne après connexion (cohérent avec D5). Seuls les comptes **connectés et validés** (statut "actif", cf. D3) peuvent créer une fiche mission — les visiteurs sont strictement en lecture. |

### Détail des options envisagées (archive)

## 9. Alternatives envisagées et écartées

- **Validation 100% automatique des inscriptions** (ex. simple vérification d'email) : écartée à ce stade — contredit la décision D3 (vérification manuelle), qui répond à un besoin de confiance explicitement demandé.
- **Messagerie externalisée (redirection vers email personnel dès le premier contact)** : écartée — contredit D5.
- **Un seul rôle "Structure" générique sans distinction Intervenant/Organisateur** : écarté — la distinction est au cœur du modèle annuaire + recherche (D1) et des permissions.

## 10. Critères de validation de la phase

- [x] D7 à D13 tranchés.
- [x] Rôles, permissions et parcours jugés complets et fidèles par l'utilisateur.
- [x] Règles de gestion validées (statuts de compte, de fiche, journalisation admin).
- [x] Risques jugés complets à ce stade.

**Phase 2 validée le 2026-08-27.** → Passage à la Phase 3 (Définition du MVP).
