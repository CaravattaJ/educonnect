# Phase 9 — Backlog

Statut : 🟡 **En attente de validation**

Ce document traduit le MVP amendé (Phase 3, avec le formulaire de contact D30) en épics et user stories priorisées, prêtes à être développées itérativement en Phase 10. Chaque story a un critère d'acceptation vérifiable.

## 1. Objectif de la phase

Découper le MVP en un ordre de développement réaliste (fondations avant fonctionnalités, sécurité intégrée en continu, pas repoussée à la fin sauf l'audit final acté en D34), pour que la Phase 10 avance itération par itération sans redécouvrir le périmètre à chaque fois.

## 2. Ordre des épics

```
E0 Fondations techniques
E1 Comptes & authentification
E2 Référentiel & taxonomie (données de base)
E3 Profils structure
E4 Fiches mission
E5 Annuaire & recherche publique
E6 Formulaire de contact
E7 Notifications
E8 Administration & modération
E9 Conformité (RGPD, mentions légales)
E10 Audit de sécurité & durcissement pré-lancement (D34)
E11 Amorçage du lancement pilote
```

Les épics E1 à E4 peuvent partiellement se chevaucher (ex. auth et référentiel en parallèle), mais E10 et E11 ferment nécessairement la marche (rien ne se lance publiquement avant l'audit sécurité, D34).

## 3. Détail des épics et user stories

### E0 — Fondations techniques
- Initialiser le projet Next.js/TypeScript avec la structure de dépôt validée (Phase 8).
- Configurer ESLint/Prettier renforcés (D37), CI GitHub Actions (lint/typecheck/tests/build).
- Configurer Prisma + connexion PostgreSQL (environnement de développement + preview Vercel).
- Intégrer HeroUI + définir la charte graphique minimale (palette, typographie, rayons — D21).
- Intégrer Sentry (D24).
- *Critère d'acceptation : un déploiement preview Vercel accessible affichant une page d'accueil minimale stylée, CI verte.*

### E1 — Comptes & authentification
- Inscription Intervenant / Organisateur (email + mot de passe), avec vérification d'email.
- Connexion via Google OAuth (D14).
- Gestion des statuts de compte (`EN_ATTENTE`, `ACTIF`, `REJETE`, `SUSPENDU`) et des permissions associées (Phase 7 §4).
- Écran "Compte en attente de validation" (Phase 4 §3.1).
- Paramètres du compte : changement de mot de passe, suppression de compte (anonymisation, D12).
- *Critère d'acceptation : un utilisateur peut s'inscrire, être bloqué en attente, et un admin (créé manuellement en base) peut le faire passer `ACTIF` ; la connexion Google fonctionne.*

### E2 — Référentiel & taxonomie
- Chargement du référentiel géographique (`Region`/`Department`/`City`, D27) via script de seed depuis une source officielle.
- CRUD Thèmes/Publics (`Theme`/`Audience`, D10) côté admin.
- *Critère d'acceptation : le référentiel géographique est interrogeable en base ; un admin peut créer/désactiver un thème.*

### E3 — Profils structure
- Création/édition du profil `Structure` (Intervenant ou Organisateur) : nom, description, logo, site web, email de contact, ville (référentiel E2).
- Upload de logo sécurisé (Phase 7 §7 : type MIME, taille, renommage).
- *Critère d'acceptation : un Intervenant actif peut compléter et enregistrer son profil, avec logo.*

### E4 — Fiches mission
- CRUD `MissionListing` côté Intervenant (brouillon/publication/dépublication).
- Sélection thèmes/publics (E2), format, ville d'intervention, budget indicatif, disponibilité (texte libre).
- Écran "Mes fiches mission" avec statuts visibles (Phase 4 §3.4).
- Rappel produit sur la limite de vérification (D33) affiché à la publication.
- *Critère d'acceptation : un Intervenant actif peut créer une fiche en brouillon, la publier, la dépublier ; le rappel D33 est visible avant publication.*

### E5 — Annuaire & recherche publique
- Page annuaire publique (sans compte requis, D13) listant les fiches publiées.
- Recherche texte + filtres (thème, public, ville/zone, format) via la base de données (D16).
- Page détail fiche mission, page détail profil Intervenant.
- *Critère d'acceptation : un visiteur non connecté peut rechercher et filtrer, et consulter une fiche sans coordonnées de contact exposées directement (cf. D5/D30).*

### E6 — Formulaire de contact
- Formulaire de contact sur une fiche/un profil (E5), création d'un `ContactRequest` (D30), envoi email à l'Intervenant via Resend.
- Throttling anti-spam (D31 : pas de captcha, limite serveur par compte/IP).
- Rappel produit D33 affiché avant envoi.
- *Critère d'acceptation : un Organisateur actif envoie un message depuis une fiche, l'Intervenant reçoit un email ; les envois excessifs sont bloqués par le throttling.*

### E7 — Notifications
- Centre de notifications in-app (validation/rejet d'inscription, nouvelle demande de contact reçue).
- Emails transactionnels correspondants (D11).
- *Critère d'acceptation : un événement (ex. réception d'un `ContactRequest`) génère une notification in-app et un email.*

### E8 — Administration & modération
- Back-office : liste des inscriptions en attente, dossier, validation/rejet avec motif.
- Gestion des comptes (recherche, suspension/réactivation, édition avec journalisation `AdminAction`).
- Gestion des signalements (`Report`) : liste, traitement (ignorer/dépublier/suspendre), justification obligatoire.
- *Critère d'acceptation : toute action admin sensible crée une entrée `AdminAction` avec justification ; un signalement peut être traité de bout en bout.*

### E9 — Conformité
- Pages mentions légales / politique de confidentialité.
- Consentement explicite à l'inscription (Phase 7 §5).
- Vérification du job de purge des `ContactRequest` > 2 ans (D32).
- *Critère d'acceptation : le consentement est requis et tracé à l'inscription ; les pages légales sont publiées et à jour.*

### E10 — Audit de sécurité & durcissement pré-lancement (D34)
- Revue des en-têtes de sécurité HTTP, CSP.
- Vérification région d'hébergement UE (Phase 7 §5).
- Vérification RBAC/contrôle de propriété sur toutes les routes sensibles (Phase 7 §4).
- Test de charge léger sur la recherche (Phase 3 §4).
- *Critère d'acceptation : rapport d'audit produit, actions correctives appliquées, avant toute ouverture publique.*

### E11 — Amorçage du lancement pilote
- Création manuelle des premiers comptes Intervenants sur la région pilote (hors périmètre technique, action produit/business).
- Vérification opérationnelle du flux de validation admin en conditions réelles.
- *Critère d'acceptation : au moins quelques structures réelles validées et visibles dans l'annuaire au lancement.*

## 4. Décisions à prendre pour valider cette phase

### D40 — Taille et cadence des itérations en Phase 10
- Itérations informelles au fil de l'eau (recommandé pour une petite équipe/développement piloté par Claude Code : livrer épic par épic, valider, avancer), ou cadence fixe (ex. sprints de 2 semaines avec revue) ?

### D41 — Definition of Done
- Confirmer qu'une story n'est "terminée" que si : code fusionné sur `main` via PR avec CI verte, tests couvrant le critère d'acceptation, revue humaine si zone sensible (D39), documentation `docs/` mise à jour si la story amende une décision antérieure.

## 5. Risques identifiés (niveau backlog)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| E10 (audit sécurité) découvre des problèmes structurants tardivement | Moyenne | Élevé | Les bonnes pratiques de Phase 7 (§3-§7) sont appliquées en continu dès E0-E1, pas seulement à l'audit final — E10 vérifie/complète, ne découvre pas from scratch |
| Sous-estimation du référentiel géographique (E2) qui bloque plusieurs épics dépendants (E3, E4, E5) | Moyenne | Moyen | Traiter E2 tôt, en parallèle de E1, avant de démarrer E3 |
| Épics développés dans le désordre par optimisme ("on fait la recherche avant les fiches") | Faible avec cet ordre documenté | Moyen | Suivre l'ordre §2, qui respecte les dépendances réelles |

## 6. Alternatives envisagées et écartées

- **Développer l'intégralité du modèle de données avant toute UI** : écarté — préférence pour un développement vertical par épic (auth complète, puis fiches complètes, etc.) qui produit de la valeur visible/testable à chaque étape plutôt qu'un gros big-bang.
- **Repousser la sécurité entièrement à E10** : écarté — contredit Phase 7 ; E10 est un audit de clôture, pas le seul moment où la sécurité est traitée.

## 7. Critères de validation de la phase

- [ ] D40 et D41 tranchées.
- [ ] Ordre des épics et stories jugé complet et réaliste pour couvrir le MVP amendé.
- [ ] Critères d'acceptation jugés suffisamment vérifiables.
