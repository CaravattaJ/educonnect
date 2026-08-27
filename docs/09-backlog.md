# Phase 9 — Backlog et avancement

Statut : **ordre révisé proposé**, D-047 validée ; aucune recette applicative effectuée dans cette révision documentaire (2026-08-27).

## 1. Objectif

Adapter le travail existant puis livrer le parcours prestataire → activité → demande. Ne pas repartir de zéro et ne pas déclarer terminé un épic sur la seule présence de fichiers.

## 2. État observé au commit 373565da4dddb91722c7691179db604af68800f9

| Bloc | Observation | Ce qui reste à démontrer |
|---|---|---|
| Socle E0 | Next.js, HeroUI, Prisma, migration, seed, configurations CI/tests présents | CI sur branche réelle, preview et recette |
| Comptes E1 | Inscription, vérification email, validation/rejet admin, paramètres et tests présents | Parcours complet, contrôles de sécurité, OAuth métier et adaptation prestataire |
| Géographie E2 | Modèles et quelques villes de seed présents | Référentiel complet et administration taxonomie |
| Profil E3 | Champs créés à l'inscription | Édition complète et upload sécurisé |
| Activités/annuaire/contact | Entités Prisma présentes | Services, écrans et tests du parcours E5/E6/E7 |
| E2E | Dépendance et commande présentes ; dossier sans tests | Parcours Playwright à écrire et exécuter |

Lecture statique uniquement : aucun résultat de test, déploiement ni audit certifié ici. La CI ne cible que main, absente au relevé.

## 3. Ordre proposé

R0 (réalignement) → clôture E0/E1 → E2 → E3 → E5 → E6 → E7 → E8 → clôture E9/E10 → E11 → E12.

**E4 — carnet d'intervenants est retiré du parcours proposé.** Les numéros suivants restent stables pour préserver les références historiques. Les actions admin indispensables sont livrées avec l'épic concerné, pas toutes repoussées à E9. Les protections sécurité s'appliquent en continu.

### R0 — Réalignement prestataire

- Faire relire P-001 ; inventorier code, données et environnements.
- Valider le mapping des comptes/propriétaires ; aucun organisateur converti automatiquement en fournisseur de ses anciennes activités.
- Adapter rôle, routes, libellés, emails, permissions, seed et tests.
- Retirer la dépendance fonctionnelle au carnet ; ne pas supprimer de tables/données sans migration approuvée.
- Revoir les sessions existantes et le plan de retour.
- Acceptation : un compte prestataire garde son identité et ses données légitimes ; un compte non éligible ne devient pas prestataire ; l'isolation et les refus d'accès passent les tests ; revue humaine auth/RBAC.

### E0 — Clôture des fondations

- Réconcilier branche principale réelle, déclenchement CI et protections.
- Générer Prisma avant les contrôles dépendants ; lint/typecheck/tests/build effectifs.
- Vérifier le thème HeroUI et la configuration des services.
- Préparer une preview isolée si les accès et le déploiement sont autorisés.
- Acceptation : CI réellement verte, preview de référence et limites documentées. Aucun déploiement automatique autorisé par cette seule note.

### E1 — Clôture des comptes prestataires

- Inscription, email vérifié, validation admin, rejet/correction/resoumission.
- Parcours Google : création/liaison locale sûre, rôle/profil et email vérifié.
- Paramètres, changement/réinitialisation de mot de passe, suppression et révocation.
- Anti-bruteforce ; états en attente, actif, rejeté, suspendu, anonymisé testés.
- Acceptation : parcours email et Google de bout en bout ; aucun accès métier pour compte suspendu ; correction de dossier sans création d'offres en attente.

### E2 — Référentiel et taxonomie

- Charger le référentiel national officiel ; garder le seed de démonstration distinct.
- CRUD admin thèmes/publics et désactivation contrôlée.
- Arbitrer P-002 avant de coder couverture et recherche par zone.
- Acceptation : données interrogeables, valeurs inactives non sélectionnables, tests de relations.

### E3 — Profil prestataire

- Édition des informations de structure, ville du siège, contact privé, site, logo.
- Upload sécurisé ; profil public limité aux champs prévus.
- Acceptation : un prestataire modifie uniquement son profil ; un visiteur ne récupère pas les coordonnées privées.

### E5 — Offres d'activités

- Création, brouillon, édition, publication et dépublication ; thèmes/publics, format, localisation et conditions.
- Prendre en compte la décision de géographie si P-002 validée.
- Publication sans fiche Intervenant ; compte actif, email vérifié et champs requis.
- Modération admin avec justification ; rappel D-033.
- Acceptation : publication possible sans carnet ; impossible depuis un compte en attente ; accès croisé refusé ; suspension rend l'offre invisible.

### E6 — Annuaire public

- Recherche texte, pagination, filtres thème/public/zone/format et détail.
- Présentation du prestataire responsable ; pas de fausse promesse de proximité ou de disponibilité.
- Acceptation : mêmes règles sur liste/détail/contact ; offre retirée inaccessible par URL directe ; données privées absentes.

### E7 — Demande directe au prestataire

- Formulaire nom/email/message ; aides à qualifier la demande.
- Destinataire calculé côté serveur, ContactRequest persistée, email et liste privée.
- Définir l'état initial d'envoi et la reprise avant implémentation ; pas de succès prématuré.
- Throttling et prévention des doublons ; rappel D-033.
- Acceptation : demande reçue par le bon prestataire ; falsification du destinataire sans effet ; échec d'email visible ; spam limité ; aucune conversation créée.

### E8 — Notifications

- Centre in-app et emails pour événements actifs.
- Éviter le double email de contact si E7 et E8 déclenchent le même événement.
- Acceptation : notification pour le bon compte, lecture privée, pas d'événement hérité de validation d'intervenant.

### E9 — Clôture administration/modération

- Validation des comptes déjà nécessaire en E1.
- Comptes, activités, signalements visiteurs, taxonomie ; audit justifié.
- Pas de seconde file de fiches Intervenant.
- Acceptation : chaque action sensible est autorisée et tracée ; traitement d'un signalement de bout en bout.

### E10 — Données et informations légales

- Revue des traitements, informations, bases légales et procédures de droits.
- Arbitrer les durées par catégorie, notamment l'ancien audit illimité D-032.
- Implémenter puis tester suppression/purge selon politique revue ; couvrir champs libres, fichiers et notifications.
- Acceptation : textes adaptés aux flux réels et procédures vérifiées ; pas de simple case « conforme ».

### E11 — Audit avant production

- Auth/RBAC/propriété, règles de visibilité, anti-abus, uploads et en-têtes.
- Dépendances, secrets, régions/contrats des services, sauvegarde et restauration.
- Tests E2E critiques et charge légère de recherche.
- Acceptation : rapport, corrections bloquantes appliquées, autorisation explicite d'ouverture.

### E12 — Amorçage pilote

- Choisir territoire et premières catégories.
- Inviter des prestataires volontaires à compléter leurs offres ; publication avec leur accord, pas de comptes fictifs ni de réutilisation automatique d'un ancien carnet.
- Vérifier des demandes réelles de bout en bout.
- Acceptation : catalogue initial réel, prestataires capables de répondre, suivi opérationnel en place.
- Pas d'enquête préalable sur le besoin ; distinguer recette logicielle et étude de marché.

## 4. Après le pilote : lot commercial distinct

[Note économique](10-modele-economique.md), P-003 : définir payeur, valeur payante, tarifs et calendrier avant tout lot abonnement. Aucun développement Stripe, quota ou encaissement d'interventions dans les épics ci-dessus.

## 5. Définition de terminé

D-040/D-041 maintenues : épics validés au fil de l'eau ; PR, CI verte sur la branche d'intégration réelle, tests des critères d'acceptation, revue humaine si zone sensible, documentation à jour. Fusion uniquement sur demande utilisateur. Un amendement de docs ne clôture pas un épic.

## 6. Risques et alternatives

Priorité au parcours vertical complet, pas à l'ajout d'un nouveau framework ou de fonctions commerciales non décidées. R0 évite un renommage trompeur ; E2 évite une recherche géographique incorrecte ; E11 garde le verrou d'ouverture publique.

- [ ] P-001 relue avant R0.
- [ ] P-002 tranchée avant géographie des offres.
- [ ] Chaque épic justifié par résultats de tests et recette, pas par coche documentaire.
