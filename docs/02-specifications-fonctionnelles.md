# Phase 2 — Spécifications fonctionnelles

Statut : **révision proposée P-001**, dérivée de D-047 (2026-08-27). Aucun changement applicatif réalisé.

## 1. Objectif

Décrire le parcours prestataire → offre → recherche → demande directe, avec droits vérifiables. Conserver les choix compatibles du MVP précédent, sans compte demandeur ni carnet d'intervenants obligatoire.

## 2. Rôles et permissions cibles

| Action | Visiteur / demandeur | Prestataire en attente ou rejeté | Prestataire actif | Admin |
|---|---|---|---|---|
| Consulter et contacter une offre visible | Oui | Oui, parcours public | Oui, parcours public | Oui |
| Corriger son dossier d'inscription | — | Oui | Oui, propre profil | Édition justifiée |
| Créer/éditer ses offres | — | Non | Oui | Édition justifiée |
| Publier ses offres | — | Non | Oui, sous conditions | Modération |
| Lire les demandes reçues | — | Non | Ses propres demandes | Uniquement si nécessaire à une action de support/modération tracée |
| Valider/suspendre un compte | — | — | — | Oui, justification et audit |

Les comptes suspendus ou anonymisés ne peuvent accéder aux actions métier privées. Un rejet peut être corrigé puis resoumis. Les droits sont vérifiés côté serveur à chaque action, pas seulement à la connexion.

La règle proposée pour les comptes en attente est volontairement unique : **correction du dossier uniquement, pas de création d'offres**. Elle remplace les autorisations contradictoires des anciennes phases 2/4/7.

## 3. Inscription et profil

- Email/mot de passe et Google OAuth maintenus (D-014).
- Vérification email distincte de la validation administrative.
- Un profil de structure par compte prestataire : nom, description, ville du siège, email de contact privé, site et logo optionnels.
- Statuts : EN_ATTENTE, ACTIF, REJETE, SUSPENDU, ANONYMISE.
- Admin : validation ou rejet motivé ; notification au prestataire. Pas de délai public garanti (D-017).
- Aucun identifiant de paiement ou document de mineur demandé au pilote.

## 4. Offres d'activités

Champs conservés : titre, description pédagogique, thèmes, publics/tranches d'âge, format présentiel/distanciel/hybride, localisation de référence, budget indicatif optionnel, disponibilités en texte libre.

La description doit expliquer le contenu, les objectifs et les conditions pratiques. Des champs structurés supplémentaires (durée, effectif, matériel, accessibilité) pourront être cadrés, sans les déclarer déjà développés.

- Une offre appartient à une seule structure prestataire ; plusieurs offres possibles sans quota au pilote (D-015).
- Statuts : BROUILLON, PUBLIEE, DEPUBLIEE.
- Publication si propriétaire actif, email vérifié et champs requis valides, avec au moins un thème et un public sélectionnables.
- Aucune fiche Intervenant distincte requise ; aucune validation individuelle d'intervenant ne bloque la publication.
- Édition/dépublication réservées au propriétaire ou à un admin autorisé et journalisé.
- Une offre dépubliée n'est ni consultable publiquement ni contactable, même par URL directe.
- Suspension/anonymisation du propriétaire : toutes ses offres deviennent immédiatement invisibles et non contactables. La réactivation ne republie pas automatiquement les offres dépubliées.

## 5. Recherche publique

Recherche texte et filtres : thème, public, zone, format. Résultats paginés, ordre déterministe. La recherche n'expose que les offres publiées de prestataires actifs et vérifiés.

Une commune de siège ne prouve pas une zone de déplacement. P-002 propose des départements desservis par offre ; tant que cette proposition n'est pas validée, ne pas promettre de recherche par zone d'intervention effective. Ni rayon kilométrique, ni classement par proximité, ni calendrier de disponibilités au MVP.

## 6. Demande de contact

1. Le visiteur ouvre une activité visible.
2. Il renseigne nom, email de réponse et message ; l'interface l'invite à préciser sa structure, le lieu souhaité, le public, la période et l'effectif, **sans données nominatives de mineurs**.
3. Le serveur détermine le destinataire depuis le propriétaire de l'activité. L'adresse destinataire ne vient jamais d'un champ libre du navigateur.
4. Une ContactRequest est enregistrée ; l'email est transmis au prestataire, pas à un établissement ayant déjà accueilli l'activité.
5. Les réponses se poursuivent par email hors plateforme. Une liste privée des demandes reçues n'est pas une messagerie.
6. Un échec d'envoi ne doit pas être présenté comme une transmission réussie. Éviter les doublons lors d'une nouvelle tentative.

Le prestataire reçoit les coordonnées saisies par le demandeur pour répondre ; l'interface l'explique avant l'envoi. Son propre email n'est pas affiché publiquement. Throttling serveur par IP et cible, sans captcha initial (D-031). Le succès technique d'envoi n'est ni une réponse du prestataire ni une intervention réservée.

## 7. Administration, taxonomie et notifications

- Validation des comptes prestataires ; pas de seconde file de validation de fiches Intervenant.
- Modération des activités/profils, suspension/réactivation, signalements ouverts aux visiteurs avec email requis (principe D-046 maintenu).
- Taxonomie fermée thèmes/publics : désactivation plutôt que suppression si utilisée.
- Notifications in-app et email : validation/rejet, nouvelle demande, suites de signalement selon le destinataire.
- Chaque action admin sensible porte une justification et une entrée d'audit.

## 8. Risques, alternatives et critères

L'absence de compte demandeur réduit les écrans nécessaires mais impose l'anti-spam et limite le suivi des échanges. Le choix conservé est le formulaire simple ; aucun CRM, fil de discussion ni suivi de réservation n'est ajouté.

Tests attendus : isolation entre deux prestataires ; refus des écritures en attente ; publication sans carnet ; refus du contact sur une offre invisible ; destinataire calculé côté serveur ; suspension effective ; succès et échec d'email ; absence de coordonnées privées dans les réponses publiques.

- [ ] Règles P-001 relues avant code.
- [ ] P-002 arbitrée avant les champs/filtres géographiques.
- [ ] Critères traduits en tests dans le backlog.
