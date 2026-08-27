# Phase 7 — Sécurité et préparation à la conformité

Statut : **exigences mises en cohérence avec D-047 ; revue d'implémentation et juridique avant production toujours requise** (2026-08-27). Ce document ne constitue ni un audit réalisé ni un avis juridique.

## 1. Objectif et responsabilité

Protéger comptes, offres et demandes professionnelles ; ne pas laisser croire que la validation d'un prestataire garantit ses habilitations à intervenir auprès de mineurs.

Le contrôle administratif porte sur les informations déclarées par le prestataire. Aucun compte ou fiche individuelle d'intervenant n'est nécessaire au parcours proposé. Conserver le rappel D-033 sur la publication et le contact, avec formulation relue avant lancement.

Ne pas demander de listes d'élèves, données nominatives d'enfants ou documents sensibles dans les descriptions/demandes. Définir le traitement d'un contenu de cette nature transmis malgré les consignes.

## 2. Authentification

- Hachage robuste des mots de passe ; préférence historique argon2id, bcrypt admis par le cadrage et déjà utilisé dans le code.
- Minimum de 12 caractères prévu ; contrôle des entrées et protection anti-bruteforce serveur.
- Vérification d'email distincte de la validation administrative.
- Google OAuth : tester email vérifié, création/liaison au compte local, rôle et profil ; aucune association non maîtrisée.
- Cookies sécurisés, expiration, révocation effective après suspension/suppression ; ne pas se fier à un rôle ancien stocké dans un JWT.
- Changement/réinitialisation de mot de passe : contrôle d'identité, jeton expirant à usage unique, pas de jeton en clair dans les logs.
- Création admin uniquement par procédure autorisée, jamais auto-inscription publique. Évaluer une protection renforcée de ces comptes avant production.

## 3. Autorisation et visibilité (P-001)

Rôles cibles PRESTATAIRE et ADMIN ; le code actuel ORGANISATEUR nécessite R0.

- Chaque action serveur vérifie identité, rôle, statut et propriété.
- Compte en attente/rejeté : correction de dossier seulement ; pas de création/publication d'offres.
- Compte actif et email vérifié : gestion de ses offres et de ses demandes privées.
- Compte suspendu/anonymisé : accès métier refusé ; offres non publiques et non contactables.
- Le statut doit être revérifié à chaque requête sensible même si le token reste valide.
- Publication sans fiche Intervenant, sous conditions de complétude de l'activité.
- Même filtre de visibilité sur annuaire, détail par identifiant et contact. Masquer un bouton ne protège pas une route.
- Destinataire du contact déterminé depuis le propriétaire de l'activité côté serveur.
- Admin : accès limité au besoin de modération/support et actions sensibles justifiées et journalisées.
- Les réponses publiques ne contiennent ni contactEmail, ni email de compte, ni données privées de demandes.

## 4. Anti-abus et transmission

- Throttling serveur connexion/inscription/contact, selon IP, compte si disponible et cible. Pas de captcha initial (D-031), ajout possible si nécessaire.
- Contact anonyme : limiter les envois répétés, les tailles de message et l'abus d'une même cible.
- Signalements : ouverts aux visiteurs avec email ; protéger contre les rafales sans empêcher un signalement légitime.
- Texte utilisateur échappé, pas de HTML arbitraire ; validation serveur systématique.
- Pas de succès de contact avant confirmation technique d'envoi ; reprise contrôlée et prévention des doublons.
- L'envoi d'email ne prouve ni livraison finale, ni lecture, ni réponse, ni intervention conclue.

## 5. Données personnelles : exigences à finaliser avant lancement

- Inventorier traitements, catégories, destinataires et sous-traitants ; définir les bases légales avec la revue compétente.
- Minimiser les données ; expliquer au demandeur que son nom/email/message sont transmis au prestataire pour réponse.
- Distinguer information de confidentialité, acceptation contractuelle éventuelle et consentements facultatifs : une case unique ne règle pas tous les traitements.
- Fournir les informations et les moyens d'exercer les droits ; définir une procédure pour les données fournies sans compte.
- Suppression D-012 : examiner profil, tokens, fichiers, demandes, notifications et champs libres d'audit, pas seulement l'email utilisateur.
- **Conservation D-032 à réexaminer** : l'historique prévoit deux ans pour les demandes et un audit indéfini. Documenter et faire valider les durées par catégorie avant production ; ne pas présenter la durée illimitée comme automatiquement justifiée.
- Définir la purge et sa vérification, y compris sur sauvegardes selon la politique retenue.
- Vérifier régions, contrats et éventuels transferts de chaque service réellement configuré ; une région UE seule n'atteste pas toute la conformité.
- Pas de suivi publicitaire au MVP. Toute nouvelle mesure d'audience doit être évaluée avant ajout.

## 6. Sécurité applicative

- Validation des entrées côté serveur ; contrôles d'accès indépendants de l'interface.
- Vérification des protections CSRF/origine pour chaque route mutante ; ne pas supposer qu'une bibliothèque couvre toute route personnalisée.
- Upload logos : type réel, taille maximale, nom généré, stockage non exécutable et accès contrôlé.
- En-têtes de sécurité adaptés et testés : CSP, HSTS en production HTTPS, nosniff, politique de référent.
- Secrets hors dépôt ; aucune valeur réelle ni URL de base sensible dans les logs/PR.
- Suivi des dépendances et vulnérabilités avant déploiement.
- Tests/previews avec données synthétiques ; aucune opération de test sur la base de production.
- Logs/Sentry : éviter mots de passe, tokens et corps de demandes.

## 7. Sauvegarde et lancement

D-035 maintenue : sauvegardes quotidiennes, rétention minimale prévue de sept jours ; vérifier le service choisi et tester une restauration.

D-034 maintenue : audit applicatif avant toute ouverture publique, rapport et correction des points bloquants. La sécurité s'applique à chaque épic ; l'audit final ne remplace pas les tests pendant le développement.

## 8. Risques, alternatives et critères

Risques prioritaires : fuite entre prestataires, accès maintenu après suspension, usurpation du destinataire, spam, fausse impression d'habilitation, données personnelles restant dans les champs libres.

Pas de vérification automatisée d'antécédents ni de promesse de certification dans cette V1. L'absence de paiement ne dispense pas de protéger les comptes et les demandes.

- [ ] Tests positifs et négatifs d'auth/RBAC/propriété.
- [ ] Visibilité cohérente après suspension/suppression.
- [ ] Protections anti-abus et envois testés.
- [ ] Politique de données et textes relus ; durées de conservation explicites.
- [ ] Restauration et audit D-034 réalisés avant production.
