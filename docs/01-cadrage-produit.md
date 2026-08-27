# Phase 1 — Cadrage produit

Statut : **orientation validée par D-047/D-048 ; traduction documentaire à relire** (2026-08-27).

## 1. Objectif et proposition de valeur

Permettre aux structures qui cherchent une intervention pédagogique de trouver une offre adaptée et de contacter directement son prestataire.

Exemple : une association scientifique publie un atelier ; une école le trouve et sollicite cette association. L'école ne doit pas publier elle-même un retour d'expérience pour rendre l'atelier visible.

## 2. Acteurs et vocabulaire

| Terme | Sens |
|---|---|
| Prestataire | Structure qui propose et assume l'offre : association, entreprise, indépendant ou autre organisme |
| Structure demandeuse | École, ACM, médiathèque, association, collectivité ou autre structure recherchant une intervention |
| Activité / offre | Prestation pédagogique proposée, pas compte rendu d'une activité passée |
| Intervenant | Personne réalisant éventuellement la prestation ; ne pas confondre avec un compte prestataire ni imposer une fiche individuelle |
| Administrateur | Valide les comptes, traite les signalements et administre la taxonomie |

Le nom provisoire EduConnect reste à vérifier avant communication commerciale (D-006). Aucun agrément institutionnel n'est revendiqué.

## 3. Décisions acquises

- **D-047** : le prestataire publie ses activités et reçoit les demandes.
- **D-048** : le besoin est considéré établi pour avancer ; aucune enquête préalable imposée. Cela ne valide pas un prix, un taux de conversion ou la rentabilité.
- D-004 : acquisition ciblée sur un territoire pilote, mais aucune restriction géographique codée en dur. Le territoire exact reste à choisir.
- D-013/D-030 maintenues dans leur principe : consultation publique et formulaire simple, pas de messagerie interne au MVP.
- D-002 maintenue pour le pilote : accès gratuit ; projet à vocation commerciale, calendrier de monétisation non arrêté.

## 4. Traduction proposée (P-001)

Un compte prestataire possède un profil de structure et plusieurs offres. Le visiteur cherche, consulte puis transmet une demande au prestataire concerné, sans compte demandeur obligatoire.

La validation manuelle porte sur le compte prestataire. Les activités sont publiables après validation du compte et contrôle des champs requis ; modération a posteriori. Le carnet de fiches individuelles et sa double validation sont retirés du parcours V1 proposé.

Le prestataire qui recherche lui-même une activité peut utiliser le parcours public : pas de second rôle ni second compte requis pour contacter.

## 5. Périmètre et alternatives

La V1 est une application web responsive, centrée sur les activités, avec profil prestataire, recherche, contact et administration.

Reportés : compte acheteur, espace multi-collaborateurs, appel d'offres, réservation, paiement des interventions, avis, messagerie, application mobile native, cartographie interactive.

- Partage d'expériences entre établissements : ancien modèle remplacé, pas de parcours hybride ajouté.
- Annuaire de personnes uniquement : insuffisant pour comparer les offres ; la fiche activité reste centrale.
- Place de marché transactionnelle : implique réservation et paiement ; hors V1.

## 6. Points ouverts

| Point | Traitement |
|---|---|
| Zone réellement desservie vs siège du prestataire | Proposition P-002 ; à valider avant recherche géographique |
| Prix, payeur, formules, calendrier | [Note économique](10-modele-economique.md), P-003 non validée |
| Territoire pilote et catégories initiales | Choix de lancement à faire ; aucune préférence supposée |
| Migration des anciens comptes et fiches | Inventaire préalable en R0 ; aucun changement automatique de propriétaire |

## 7. Risques et réponses

| Risque | Impact | Réponse |
|---|---|---|
| Offres peu renseignées ou périmées | Mauvaises demandes | Champs utiles, édition simple, dépublication |
| Peu d'offres dans une zone | Annuaire peu utile | Amorçage ciblé avec prestataires volontaires |
| Validation assimilée à une habilitation | Fausse confiance | Limites visibles et revue pré-lancement D-033/D-034 |
| Besoin réel mais abonnement non acheté | Économie incertaine | Prix explicitement hypothétiques, suivi des demandes utiles |
| Requalification abusive d'anciennes données | Mauvais auteur/destinataire | Migration manuelle contrôlée après inventaire |

## 8. Critères de validation

- [x] Qui publie et reçoit les demandes : prestataire (réponse utilisateur explicite).
- [x] Pas d'enquête préalable bloquante.
- [ ] Traduction fonctionnelle P-001 relue.
- [ ] Géographie P-002 tranchée avant implémentation.
- [ ] Offre commerciale décidée avant lancement payant.
