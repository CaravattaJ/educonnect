# Phase 3 — Définition du MVP

Statut : ✅ **Validée** (amendée le 2026-08-27, deux fois)

Ce document découpe les spécifications fonctionnelles (Phase 2) en un **périmètre livrable en premier** (MVP) et un **backlog d'évolutions**. Objectif : livrer vite une valeur réelle (annuaire d'activités pédagogiques avec Intervenants déclarés) sans sur-construire.

> **Amendement 1 (pendant la Phase 6)** : la messagerie interne (D5, Phase 2 §4.4) est retirée du périmètre MVP, remplacée par un formulaire de contact simple (D30).
>
> **Amendement 2 (pivot de modèle)** : le modèle passe d'"Intervenants publiant des offres" à un **annuaire d'activités publiées par les Organisateurs**, chacune déclarant au moins un Intervenant (fiche sans compte, modérée par l'admin). Deux rôles de compte seulement : Organisateur et Admin. Voir `docs/01-cadrage-produit.md`, `docs/02-specifications-fonctionnelles.md` et `docs/DECISIONS.md` (D-042 à D-045). Ce document est réécrit intégralement pour refléter ce pivot.

## 1. Objectif de la phase

Trancher précisément ce qui est **dans** la v1 et ce qui est **explicitement reporté**, avec des critères d'acceptation vérifiables, pour que les phases UX/Architecture/Modèle de données/Sécurité travaillent sur un périmètre stable.

## 2. Rappel des contraintes déjà validées (Phases 1-2, révisées)

- Modèle annuaire d'activités, publiées par l'Organisateur, chacune déclarant ≥1 Intervenant validé (D1/D42).
- Gratuit au lancement (D2).
- Vérification manuelle des comptes Organisateur **et** des fiches Intervenant + espace admin, rôle admin unique (D3, D9, D44).
- Portée région pilote, filtre géographique générique (D4).
- Deux rôles de compte : Organisateur, Admin (D43 — D7 obsolète).
- Pas d'avis/réputation au MVP (D8).
- Taxonomie thématiques/publics en liste fermée gérée par les admins (D10).
- Notifications in-app + email (D11).
- Suppression de compte par anonymisation (D12).
- Annuaire public en lecture (activités), création de contenu réservée aux comptes Organisateur validés (D13).
- Contact via formulaire simple vers l'Organisateur, pas de messagerie interne (D30, révisé D5).

## 3. Périmètre du MVP

### 3.1 Inclus dans le MVP

**Comptes & authentification**
- Inscription Organisateur (email + mot de passe + SSO Google, D14).
- Statuts de compte : en attente, actif, rejeté, suspendu.
- Édition de profil structure.

**Vérification & administration**
- Back-office admin : liste des inscriptions Organisateur en attente, validation/rejet avec motif.
- Back-office admin : liste des fiches Intervenant en attente, validation/rejet avec motif.
- Gestion des signalements (liste, actions : ignorer / dépublier / suspendre).
- Édition directe d'un compte, d'une activité ou d'une fiche Intervenant par un admin, avec journalisation.
- Gestion de la taxonomie (thématiques, publics) par les admins.

**Intervenants (carnet géré par l'Organisateur)**
- CRUD fiche Intervenant côté Organisateur (nom, structure, description, contact interne).
- Statuts : en attente, validée, rejetée, désactivée.
- Réutilisation d'une fiche validée sur plusieurs activités.

**Activités**
- CRUD activité côté Organisateur (titre, description, thématique(s), public(s), format, zone géographique, disponibilité, budget indicatif optionnel), avec association d'au moins un Intervenant.
- Statuts : brouillon, publiée, dépubliée.
- Publication bloquée tant que tous les Intervenants déclarés ne sont pas validés (D45).

**Recherche & annuaire**
- Annuaire public (lecture seule, sans compte) des activités publiées.
- Recherche texte + filtres (thématique, public, zone géographique, format).

**Contact**
- Formulaire de contact simple sur une fiche activité : le visiteur saisit un message et son email, envoyé à l'Organisateur (adresse non exposée publiquement), sans conversation stockée ni fil de discussion.
- Limitation anti-spam basique (throttling par IP) sur ce formulaire.

**Notifications**
- In-app (centre de notifications) + email pour : validation/rejet d'inscription, validation/rejet de fiche Intervenant, nouvelle demande de contact reçue.

**Conformité minimale**
- Mentions légales, politique de confidentialité, consentement RGPD à l'inscription.
- Suppression de compte (anonymisation) accessible depuis le profil.

### 3.2 Explicitement reporté après le MVP

- **Messagerie interne complète** (conversations, fil de discussion). Le MVP se limite au formulaire de contact simple ci-dessus.
- Avis/réputation (D8).
- Système d'appel à candidatures (option B de D1, historique — n'a plus le même sens dans le modèle annuaire d'activités, à réévaluer si réintroduit).
- Paiement, abonnement, commission (D2).
- Sous-rôles admin (D9).
- Application mobile native.
- Multi-langue.
- Statistiques avancées / tableau de bord analytics pour les structures.
- Fiches Intervenant partagées/mutualisées entre plusieurs comptes Organisateur (chaque Organisateur garde son propre carnet, cf. Phase 2 §9).

## 4. Exigences non fonctionnelles minimales du MVP

- **RGPD** : consentement explicite, page de politique de confidentialité, droit à l'anonymisation opérationnel dès le MVP (pas différé).
- **Disponibilité** : pas d'exigence de haute disponibilité (SLA informel) au lancement pilote — un hébergement mono-région suffit (à confirmer en Phase 5).
- **Performance** : recherche/filtrage perçue comme instantanée pour un volume de données "région pilote" (quelques centaines à quelques milliers d'activités) — pas besoin d'un moteur de recherche dédié au MVP (cf. décision D16).
- **Sécurité de base** : authentification sécurisée (hash des mots de passe, protection anti-bruteforce), contrôle d'accès strict par rôle, journalisation des actions admin. Détail complet en Phase 7.
- **Accessibilité** : niveau de base raisonnable (contraste, navigation clavier, alt texte) sans certification RGAA formelle au MVP — objectif à affiner en Phase UX.
- **Responsive** : web responsive (mobile/tablette/desktop), pas d'app native (cf. Phase 1).

## 5. Critères de succès du MVP

Proposition d'indicateurs, à confirmer :
- Nombre de comptes Organisateur inscrits et validés sur la région pilote.
- Nombre d'activités publiées.
- Nombre de fiches Intervenant validées.
- Nombre de demandes de contact envoyées via le formulaire.
- Délai moyen de validation (comptes et fiches Intervenant) par les admins.

## 6. Décisions — validées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D14 | **Email + mot de passe + SSO Google** dès le MVP. Implique une intégration OAuth (Google) en plus de l'auth classique — impact sur la Phase 5 (Architecture) : choix d'une librairie/service d'authentification qui supporte nativement les deux. |
| D15 | **Illimité.** Pas de plafond d'activités par Organisateur ; la modération a posteriori (signalement + action admin) suffit à gérer les abus. |
| D16 | **Recherche via la base de données** (index texte simple), pas de moteur dédié au MVP. |
| D17 | **Pas d'engagement de délai formel** communiqué aux utilisateurs pour la validation admin au MVP (comptes et fiches Intervenant). Le délai de traitement reste néanmoins suivi comme métrique de vigilance interne (cf. §7 risques). |
| D30 | **Contact par formulaire email simple**, sans messagerie interne au MVP. Le visiteur envoie un message via un formulaire sur l'activité ; il est transmis par email à l'Organisateur. Pas de conversation persistée en base au MVP. |

## 7. Risques identifiés (niveau MVP)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Peu d'Organisateurs/activités inscrites au lancement → annuaire vide, pas de valeur perçue ("cold start") | Élevée | Élevé | Prévoir un plan d'amorçage hors produit (recrutement manuel des premiers Organisateurs sur la région pilote) — hors périmètre technique mais à anticiper |
| Double validation manuelle (comptes + fiches Intervenant, D3/D44) devient un goulot d'étranglement si le volume dépasse la capacité admin | Moyenne | Moyen | D17 (pas de délai communiqué) + suivi du nombre de comptes/fiches en attente comme métrique de vigilance |
| Périmètre MVP qui dérive en cours de développement | Moyenne | Élevé | Le présent document fait foi ; toute extension de périmètre doit être documentée comme un amendement explicite, pas ajoutée silencieusement |
| Recherche basique (D16, option A) insuffisante si le volume de données grossit vite | Faible au lancement | Moyen | Architecture pensée pour permettre un remplacement ultérieur du moteur de recherche sans réécrire le modèle de données (cf. Phase 5) |
| Organisateur crée des fiches Intervenant de complaisance pour publier vite (moins de "double contrôle" que dans un modèle à deux comptes indépendants) | Moyenne | Moyen | Validation admin systématique des fiches Intervenant (D44), signalement a posteriori des activités douteuses |

## 8. Alternatives envisagées et écartées

- **MVP incluant le système d'appel à candidatures (option B de D1 historique)** : écarté — n'a plus vraiment de sens dans un modèle où l'Organisateur publie lui-même ses activités déjà réalisées/organisées, plutôt qu'un appel ouvert à des Intervenants candidats.
- **MVP sans validation manuelle des fiches Intervenant** : écarté — laisserait un Organisateur publier une activité avec un Intervenant non vérifié, ce qui affaiblirait la confiance que la validation des comptes est censée apporter (cf. D3/D44).
- **MVP multi-région dès le départ** : écarté — contredit D4 (région pilote), et complique inutilement le plan d'amorçage.

## 9. Critères de validation de la phase

- [x] D14 à D17, D30 tranchées.
- [x] Liste "inclus / reporté" validée et amendée deux fois (retrait messagerie, pivot annuaire d'activités).
- [x] Exigences non fonctionnelles jugées suffisantes pour un lancement pilote.
- [x] Critères de succès confirmés ou ajustés.

**Phase 3 validée le 2026-08-27, amendée le 2026-08-27 (deux fois).** → Passage à la Phase 4 (UX), également amendée.
