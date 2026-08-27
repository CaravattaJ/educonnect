# Phase 9 — Backlog

Statut : ✅ **Validée** (amendée le 2026-08-27 — épics E1, E3, E4 réécrits, E5-E6 ajustés)

> **Amendement du 2026-08-27 (pivot de modèle)** : les épics liés aux comptes (E1), profils (E3) et fiches (E4) sont réécrits pour le modèle annuaire d'activités (Organisateur/Admin uniquement, carnet d'Intervenants, règle de publication). Un nouvel épic **E4bis — Intervenants** est inséré. Voir `docs/DECISIONS.md` D-042 à D-046.

Ce document traduit le MVP amendé (Phase 3, pivot annuaire d'activités) en épics et user stories priorisées, prêtes à être développées itérativement en Phase 10. Chaque story a un critère d'acceptation vérifiable.

## 1. Objectif de la phase

Découper le MVP en un ordre de développement réaliste (fondations avant fonctionnalités, sécurité intégrée en continu, pas repoussée à la fin sauf l'audit final acté en D34), pour que la Phase 10 avance itération par itération sans redécouvrir le périmètre à chaque fois.

## 2. Ordre des épics

```
E0 Fondations techniques
E1 Comptes & authentification (Organisateur)
E2 Référentiel & taxonomie (données de base)
E3 Profil structure (Organisateur)
E4 Intervenants (carnet géré par l'Organisateur)
E5 Activités
E6 Annuaire & recherche publique
E7 Formulaire de contact
E8 Notifications
E9 Administration & modération
E10 Conformité (RGPD, mentions légales)
E11 Audit de sécurité & durcissement pré-lancement (D34)
E12 Amorçage du lancement pilote
```

Les épics E1 à E5 peuvent partiellement se chevaucher (ex. auth et référentiel en parallèle), mais E11 et E12 ferment nécessairement la marche (rien ne se lance publiquement avant l'audit sécurité, D34). E4 (Intervenants) précède nécessairement E5 (Activités), puisqu'une activité requiert au moins un Intervenant.

## 3. Détail des épics et user stories

### E0 — Fondations techniques
- Initialiser le projet Next.js/TypeScript avec la structure de dépôt validée (Phase 8).
- Configurer ESLint/Prettier renforcés (D37), CI GitHub Actions (lint/typecheck/tests/build).
- Configurer Prisma + connexion PostgreSQL (environnement de développement + preview Vercel).
- Intégrer HeroUI + définir la charte graphique minimale (palette, typographie, rayons — D21).
- Intégrer Sentry (D24).
- *Critère d'acceptation : un déploiement preview Vercel accessible affichant une page d'accueil minimale stylée, CI verte.*

### E1 — Comptes & authentification (Organisateur)
- Inscription Organisateur (email + mot de passe), avec vérification d'email.
- Connexion via Google OAuth (D14).
- Gestion des statuts de compte (`EN_ATTENTE`, `ACTIF`, `REJETE`, `SUSPENDU`) et des permissions associées (Phase 7 §4).
- Écran "Compte en attente de validation" (Phase 4 §3.1).
- Paramètres du compte : changement de mot de passe, suppression de compte (anonymisation, D12).
- Création manuelle d'un premier compte `ADMIN` (script/accès direct base, pas d'auto-inscription).
- *Critère d'acceptation : un Organisateur peut s'inscrire, être bloqué en attente, et un admin peut le faire passer `ACTIF` ; la connexion Google fonctionne.*

### E2 — Référentiel & taxonomie
- Chargement du référentiel géographique (`Region`/`Department`/`City`, D27) via script de seed depuis une source officielle.
- CRUD Thèmes/Publics (`Theme`/`Audience`, D10) côté admin.
- *Critère d'acceptation : le référentiel géographique est interrogeable en base ; un admin peut créer/désactiver un thème.*

### E3 — Profil structure (Organisateur)
- Création/édition du profil `Structure` : nom, description, logo, site web, email de contact, ville (référentiel E2).
- Upload de logo sécurisé (Phase 7 §7 : type MIME, taille, renommage).
- *Critère d'acceptation : un Organisateur actif peut compléter et enregistrer son profil, avec logo.*

### E4 — Intervenants (carnet géré par l'Organisateur)
- CRUD `Intervenant` côté Organisateur : nom, structure, description, contact interne.
- Statuts (`EN_ATTENTE`, `VALIDEE`, `REJETEE`, `DESACTIVEE`) et notification à l'Organisateur lors de la validation/rejet.
- Écran "Mes intervenants" (Phase 4 §3.2).
- *Critère d'acceptation : un Organisateur actif crée une fiche Intervenant, elle apparaît `EN_ATTENTE` ; un admin peut la valider, l'Organisateur en est notifié.*

### E5 — Activités
- CRUD `Activity` côté Organisateur (brouillon/publication/dépublication), avec sélection d'un ou plusieurs `Intervenant` du carnet (E4).
- Sélection thèmes/publics (E2), format, ville, budget indicatif, disponibilité (texte libre).
- Contrôle serveur de la règle de publication (D45) : passage en `PUBLIEE` refusé si un Intervenant associé n'est pas `VALIDEE`.
- Écran "Mes activités" avec statuts visibles (Phase 4 §3.3).
- Rappel produit sur la limite de vérification (D33) affiché à la publication.
- *Critère d'acceptation : un Organisateur actif crée une activité en brouillon avec un Intervenant non encore validé → la publication est bloquée avec un message explicite ; une fois l'Intervenant validé, la publication réussit ; le rappel D33 est visible.*

### E6 — Annuaire & recherche publique
- Page annuaire publique (sans compte requis, D13) listant les activités publiées.
- Recherche texte + filtres (thème, public, ville/zone, format) via la base de données (D16).
- Page détail activité, affichant le ou les Intervenants déclarés (sans coordonnées) et un résumé de l'Organisateur.
- *Critère d'acceptation : un visiteur non connecté peut rechercher et filtrer, et consulter une activité sans coordonnées de contact exposées directement (cf. D5/D30).*

### E7 — Formulaire de contact
- Formulaire de contact sur une fiche activité (E6), création d'un `ContactRequest` (D30), envoi email à l'Organisateur (destinataire) via Resend.
- Throttling anti-spam par IP (D31, §6 révisé).
- Rappel produit D33 affiché avant envoi.
- *Critère d'acceptation : un visiteur (sans compte) envoie un message depuis une activité, l'Organisateur reçoit un email ; les envois excessifs depuis une même IP sont bloqués par le throttling.*

### E8 — Notifications
- Centre de notifications in-app (validation/rejet d'inscription, validation/rejet de fiche Intervenant, nouvelle demande de contact reçue).
- Emails transactionnels correspondants (D11).
- *Critère d'acceptation : un événement (ex. réception d'un `ContactRequest`, validation d'un `Intervenant`) génère une notification in-app et un email.*

### E9 — Administration & modération
- Back-office : liste des inscriptions Organisateur en attente, dossier, validation/rejet avec motif.
- Back-office : liste des fiches Intervenant en attente, dossier, validation/rejet avec motif.
- Gestion des comptes (recherche, suspension/réactivation, édition avec journalisation `AdminAction`).
- Gestion des signalements (`Report`, y compris émis par un visiteur non connecté, D46) : liste, traitement (ignorer/dépublier/suspendre), justification obligatoire.
- *Critère d'acceptation : toute action admin sensible crée une entrée `AdminAction` avec justification ; une fiche Intervenant et un signalement peuvent chacun être traités de bout en bout.*

### E10 — Conformité
- Pages mentions légales / politique de confidentialité.
- Consentement explicite à l'inscription (Phase 7 §5).
- Vérification du job de purge des `ContactRequest` > 2 ans (D32).
- *Critère d'acceptation : le consentement est requis et tracé à l'inscription ; les pages légales sont publiées et à jour.*

### E11 — Audit de sécurité & durcissement pré-lancement (D34)
- Revue des en-têtes de sécurité HTTP, CSP.
- Vérification région d'hébergement UE (Phase 7 §5).
- Vérification RBAC/contrôle de propriété sur toutes les routes sensibles, y compris la règle de publication (Phase 7 §4).
- Test de charge léger sur la recherche (Phase 3 §4).
- *Critère d'acceptation : rapport d'audit produit, actions correctives appliquées, avant toute ouverture publique.*

### E12 — Amorçage du lancement pilote
- Création manuelle des premiers comptes Organisateur (et de leurs activités/intervenants) sur la région pilote (hors périmètre technique, action produit/business).
- Vérification opérationnelle du flux de double validation (comptes + fiches Intervenant) en conditions réelles.
- *Critère d'acceptation : au moins quelques activités réelles publiées et visibles dans l'annuaire au lancement.*

## 4. Décisions — validées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D40 | **Au fil de l'eau, épic par épic** — pas de cadence calendaire fixe. Chaque épic est livré et validé avant de passer au suivant. |
| D41 | **Definition of Done confirmée** : code fusionné sur `main` via PR avec CI verte, tests couvrant le critère d'acceptation, revue humaine si zone sensible (D39), documentation `docs/` mise à jour si la story amende une décision antérieure. |

## 5. Risques identifiés (niveau backlog)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| E11 (audit sécurité) découvre des problèmes structurants tardivement | Moyenne | Élevé | Les bonnes pratiques de Phase 7 sont appliquées en continu dès E0-E1, pas seulement à l'audit final — E11 vérifie/complète, ne découvre pas from scratch |
| Sous-estimation du référentiel géographique (E2) qui bloque plusieurs épics dépendants (E3, E4, E5, E6) | Moyenne | Moyen | Traiter E2 tôt, en parallèle de E1, avant de démarrer E3 |
| Dépendance E4 → E5 (un Intervenant validé requis pour publier) mal comprise en développement, tentative de publier E5 avant E4 stable | Faible avec cet ordre documenté | Moyen | Suivre l'ordre §2 ; les tests d'acceptation de E5 dépendent explicitement d'un Intervenant `VALIDEE` créé par E4 |

## 6. Alternatives envisagées et écartées

- **Développer l'intégralité du modèle de données avant toute UI** : écarté — préférence pour un développement vertical par épic qui produit de la valeur visible/testable à chaque étape plutôt qu'un gros big-bang.
- **Repousser la sécurité entièrement à E11** : écarté — contredit Phase 7 ; E11 est un audit de clôture, pas le seul moment où la sécurité est traitée.
- **Fusionner E4 (Intervenants) et E5 (Activités) en un seul épic** : écarté — la dépendance (un Intervenant doit être validé avant qu'une activité ne puisse le référencer et être publiée) est plus claire et testable si les deux épics sont livrés et validés séparément, dans l'ordre.

## 7. Critères de validation de la phase

- [x] D40 et D41 tranchées.
- [x] Ordre des épics et stories jugé complet et réaliste pour couvrir le MVP pivoté (annuaire d'activités, carnet d'intervenants).
- [x] Critères d'acceptation jugés suffisamment vérifiables.

**Phase 9 validée le 2026-08-27, amendée le 2026-08-27 (pivot de modèle).** → Passage à la Phase 10 (Développement itératif), en commençant par l'épic E0 (Fondations techniques).
