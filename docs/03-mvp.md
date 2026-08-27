# Phase 3 — Définition du MVP

Statut : ✅ **Validée**

Ce document découpe les spécifications fonctionnelles (Phase 2) en un **périmètre livrable en premier** (MVP) et un **backlog d'évolutions**. Objectif : livrer vite une valeur réelle (mise en relation Intervenants ↔ Organisateurs) sans sur-construire.

## 1. Objectif de la phase

Trancher précisément ce qui est **dans** la v1 et ce qui est **explicitement reporté**, avec des critères d'acceptation vérifiables, pour que les phases UX/Architecture/Modèle de données/Sécurité travaillent sur un périmètre stable.

## 2. Rappel des contraintes déjà validées (Phases 1-2)

- Modèle annuaire + messagerie interne (D1, D5).
- Gratuit au lancement (D2).
- Vérification manuelle des structures + espace admin, rôle admin unique (D3, D9).
- Portée région pilote, filtre géographique générique (D4).
- Un type de compte par utilisateur : Intervenant, Organisateur, ou Admin (D7).
- Pas d'avis/réputation au MVP (D8).
- Taxonomie thématiques/publics en liste fermée gérée par les admins (D10).
- Notifications in-app + email (D11).
- Suppression de compte par anonymisation (D12).
- Annuaire public en lecture, création de contenu réservée aux comptes validés (D13).

## 3. Périmètre du MVP (proposition)

### 3.1 Inclus dans le MVP

**Comptes & authentification**
- Inscription Intervenant / Organisateur (email + mot de passe).
- Statuts de compte : en attente, actif, rejeté, suspendu.
- Édition de profil structure.

**Vérification & administration**
- Back-office admin : liste des inscriptions en attente, validation/rejet avec motif.
- Gestion des signalements (liste, actions : ignorer / dépublier / suspendre).
- Édition directe d'un compte ou d'une fiche par un admin, avec journalisation.
- Gestion de la taxonomie (thématiques, publics) par les admins.

**Fiches mission**
- CRUD fiche mission côté Intervenant (titre, description, thématique(s), public(s), format, zone géographique, disponibilité, budget indicatif optionnel).
- Statuts : brouillon, publiée, dépubliée.

**Recherche & annuaire**
- Annuaire public (lecture seule, sans compte) des fiches publiées et profils Intervenants actifs.
- Recherche texte + filtres (thématique, public, zone géographique, format).

**Mise en relation & messagerie**
- Ouverture de conversation par un Organisateur vers un Intervenant (depuis une fiche).
- Messagerie interne texte, indicateur lu/non lu.
- Signalement d'une conversation/d'un message.

**Notifications**
- In-app (centre de notifications) + email pour : validation/rejet d'inscription, nouveau message, nouvelle demande de contact.

**Conformité minimale**
- Mentions légales, politique de confidentialité, consentement RGPD à l'inscription.
- Suppression de compte (anonymisation) accessible depuis le profil.

### 3.2 Explicitement reporté après le MVP

- Avis/réputation (D8).
- Système d'appel à candidatures (option B de D1).
- Paiement, abonnement, commission (D2).
- Pièces jointes dans la messagerie.
- Sous-rôles admin (D9).
- Application mobile native.
- Multi-langue.
- Statistiques avancées / tableau de bord analytics pour les structures.
- Clôture formelle d'une mise en relation ("intervention réalisée").

## 4. Exigences non fonctionnelles minimales du MVP

- **RGPD** : consentement explicite, page de politique de confidentialité, droit à l'anonymisation opérationnel dès le MVP (pas différé).
- **Disponibilité** : pas d'exigence de haute disponibilité (SLA informel) au lancement pilote — un hébergement mono-région suffit (à confirmer en Phase 5).
- **Performance** : recherche/filtrage perçue comme instantanée pour un volume de données "région pilote" (quelques centaines à quelques milliers de fiches) — pas besoin d'un moteur de recherche dédié au MVP (cf. décision D16).
- **Sécurité de base** : authentification sécurisée (hash des mots de passe, protection anti-bruteforce), contrôle d'accès strict par rôle, journalisation des actions admin. Détail complet en Phase 7.
- **Accessibilité** : niveau de base raisonnable (contraste, navigation clavier, alt texte) sans certification RGAA formelle au MVP — objectif à affiner en Phase UX.
- **Responsive** : web responsive (mobile/tablette/desktop), pas d'app native (cf. Phase 1).

## 5. Critères de succès du MVP (à valider/ajuster avec l'utilisateur)

Proposition d'indicateurs, à confirmer :
- Nombre de structures inscrites et validées (Intervenants / Organisateurs) sur la région pilote.
- Nombre de fiches mission publiées.
- Nombre de conversations initiées.
- Taux de réponse des Intervenants aux demandes de contact.
- Délai moyen de validation d'une inscription par les admins.

## 6. Décisions — validées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D14 | **Email + mot de passe + SSO Google** dès le MVP. Implique une intégration OAuth (Google) en plus de l'auth classique — impact sur la Phase 5 (Architecture) : choix d'une librairie/service d'authentification qui supporte nativement les deux. |
| D15 | **Illimité.** Pas de plafond de fiches mission par Intervenant ; la modération a posteriori (signalement + action admin) suffit à gérer les abus. |
| D16 | **Recherche via la base de données** (index texte simple), pas de moteur dédié au MVP. |
| D17 | **Pas d'engagement de délai formel** communiqué aux utilisateurs pour la validation admin au MVP. Le délai de traitement reste néanmoins suivi comme métrique de vigilance interne (cf. §7 risques). |

## 7. Risques identifiés (niveau MVP)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Peu de structures inscrites au lancement → annuaire vide, pas de valeur perçue ("cold start") | Élevée | Élevé | Prévoir un plan d'amorçage hors produit (recrutement manuel des premiers Intervenants sur la région pilote) — hors périmètre technique mais à anticiper |
| Validation manuelle (D3) devient un goulot d'étranglement si le volume dépasse la capacité admin | Moyenne | Moyen | D17 (délai communiqué) + suivi du nombre de comptes en attente comme métrique de vigilance |
| Périmètre MVP qui dérive en cours de développement | Moyenne | Élevé | Le présent document fait foi ; toute extension de périmètre doit être documentée comme un amendement explicite, pas ajoutée silencieusement |
| Recherche basique (D16, option A) insuffisante si le volume de données grossit vite | Faible au lancement | Moyen | Architecture pensée pour permettre un remplacement ultérieur du moteur de recherche sans réécrire le modèle de données (cf. Phase 5) |

## 8. Alternatives envisagées et écartées

- **MVP incluant le système d'appel à candidatures (option B de D1)** : écarté — le modèle annuaire + messagerie suffit à valider la valeur (mise en relation) avec beaucoup moins de complexité d'état (statuts de candidature, sélection).
- **MVP sans validation manuelle des structures** : écarté — contredit D3, qui répond à un besoin explicite de confiance/modération porté par l'utilisateur.
- **MVP multi-région dès le départ** : écarté — contredit D4 (région pilote), et complique inutilement le plan d'amorçage.

## 9. Critères de validation de la phase

- [x] D14 à D17 tranchés.
- [x] Liste "inclus / reporté" validée ou amendée par l'utilisateur.
- [x] Exigences non fonctionnelles jugées suffisantes pour un lancement pilote.
- [x] Critères de succès confirmés ou ajustés.

**Phase 3 validée le 2026-08-27.** → Passage à la Phase 4 (UX).
