# Phase 3 — MVP

Statut : **révision proposée P-001** ; D-047 validée, exigences compatibles conservées (2026-08-27).

## 1. Objectif

Livrer un parcours complet : un prestataire crée une offre, une structure demandeuse la trouve et contacte directement ce prestataire. Ni retour d'expérience d'établissement, ni réservation automatique.

## 2. Périmètre inclus

| Bloc | Attendu V1 |
|---|---|
| Prestataire | Inscription, email vérifié, validation manuelle, profil de structure |
| Offres | Création, édition, publication/dépublication ; plusieurs offres par prestataire |
| Annuaire | Public, recherche texte, filtres thème/public/zone/format, pagination |
| Fiche activité | Contenu pédagogique, conditions, budget indicatif, présentation du prestataire |
| Mise en relation | Formulaire sans compte demandeur, email direct au prestataire, historique privé des demandes reçues |
| Administration | Comptes, activités, signalements, taxonomie, journal d'audit |
| Notifications | In-app et email |
| Qualité | Responsive, accessibilité de base, permissions serveur, anti-spam, audit avant production |

Le filtre « zone » dépend de P-002 : ne pas confondre ville du siège et territoires desservis. La portée technique est nationale ; l'acquisition initiale est ciblée sur un territoire à choisir (D-004).

## 3. Économie du pilote

D-002 reste la référence d'implémentation : **pilote gratuit, sans paiement ni quota de fiches**. Cela ne signifie pas gratuité définitive.

Le projet vise une offre payante ; le payeur, les formules, le prix et la date d'activation ne sont pas validés. La [note économique](10-modele-economique.md) sépare :
- l'abonnement éventuel au service EduConnect ;
- le règlement des interventions, qui reste hors plateforme dans la V1.

Ne pas afficher de tarifs définitifs ni construire une intégration de paiement avant arbitrage de P-003.

## 4. Explicitement reporté ou retiré

- Carnet d'intervenants sans compte et double validation : retirés du parcours proposé ; tables existantes non supprimées par cette révision.
- Comptes demandeurs, collaboration multi-utilisateurs, gestion de plusieurs structures par compte.
- Messagerie, chat, pièces jointes aux demandes, réservation et agenda synchronisé.
- Paiement des interventions, commissions, devis/factures des prestataires, signature de contrats.
- Avis/notations, appels à projets, matching automatique ou IA.
- Carte interactive et recherche par rayon, application native, multilingue.
- Vérification automatisée d'habilitations et toute promesse de certification.

## 5. Conditions de publication et de visibilité

Compte prestataire actif + email vérifié + offre complète. Aucun intervenant individuel à déclarer obligatoirement.

Les listes, détails publics et formulaires appliquent les mêmes règles de visibilité, y compris après suspension ou suppression du compte. Modération des activités a posteriori ; aucune republication automatique d'une offre retirée.

## 6. Critères de sortie du MVP

- Un prestataire peut s'inscrire, être validé, publier puis dépublier une offre.
- Un visiteur trouve une offre pertinente et sa demande arrive au bon prestataire.
- Les états vides, erreurs et échecs d'envoi sont explicites.
- Un prestataire ne peut lire ni modifier les données privées d'un autre.
- Les garde-fous anti-spam et les parcours admin sont testés.
- Les tests applicatifs et E2E critiques passent ; revue des zones sensibles réalisée.
- Audit sécurité D-034 et revue des informations légales achevés avant ouverture publique.
- Quelques offres réelles sont publiées avec l'accord de leurs prestataires ; pas de faux catalogue.
- La CI et la branche d'intégration sont réellement opérationnelles, pas seulement documentées.

## 7. Indicateurs utiles, sans objectif chiffré inventé

Prestataires actifs, offres publiées par territoire/thème, recherches sans résultat, demandes envoyées et échecs techniques, délai de validation administrative.

Une demande envoyée ne mesure pas une prestation vendue. Le suivi éventuel des réponses et interventions conclues exige un mécanisme volontaire distinct, pas une déduction à partir des emails.

## 8. Arbitrages et risques

Le périmètre privilégie la mise en relation sans transactions. Risques principaux : catalogue trop peu fourni, spam et mauvaise qualification des demandes. Amorçage ciblé, champs explicites et protections serveur y répondent sans rouvrir une enquête sur l'existence du besoin.

- [x] Orientation prestataire confirmée.
- [ ] P-001 et P-002 relues avant réalisation des parcours concernés.
- [ ] Critères de sortie démontrés ; aucune case de recette n'est validée par ce document seul.
