# Phase 6 — Modèle de données et transition

Statut : **cible proposée P-001**, géographie P-002 à arbitrer (2026-08-27). Le schéma Prisma existant n'est pas modifié par cette révision.

## 1. Objectif

Décrire le modèle prestataire sans confondre cible documentaire et base actuelle. Conserver les entités réutilisables et préserver les données existantes pendant la transition.

## 2. Relations cibles

| Relation | Cardinalité / règle |
|---|---|
| User → Structure | Un profil par compte prestataire ; pas de profil obligatoire pour Admin |
| Structure → Activity | Un prestataire possède plusieurs offres ; une offre a un propriétaire |
| Activity → Theme / Audience | Plusieurs thèmes et publics via les jointures existantes |
| Structure → City | Ville du siège, pas une zone d'intervention |
| Activity → City | Localisation de référence, pas toute la couverture géographique |
| Region → Department → City | Référentiel national structuré |
| ContactRequest → Activity / Structure | Activité sollicitée et son prestataire destinataire |
| Notification → User | Destinataire privé |
| Report / AdminAction → cible | Référence polymorphe contrôlée côté serveur (D-029) |

Ni Conversation ni Message au MVP. Les fiches individuelles Intervenant et la jointure ActivityIntervenant ne sont pas requises par la cible.

## 3. Comptes et structure

### User

Champs conservés : id UUID, email unique, passwordHash nullable, googleId nullable unique, **emailVerifiedAt nullable** (déjà présent dans le code), accountStatus, rejectionReason, createdAt/updatedAt, anonymizedAt.

Rôle cible proposé : **PRESTATAIRE ou ADMIN**. Le code courant utilise encore ORGANISATEUR. Ne pas accepter un rôle choisi librement par le client à l'inscription.

Statuts conservés : EN_ATTENTE → ACTIF ou REJETE ; REJETE → EN_ATTENTE après correction/resoumission ; ACTIF → SUSPENDU ; réactivation explicite possible. La suppression rend le compte ANONYMISE et révoque ses accès. La validation admin et la vérification email sont deux conditions distinctes.

### EmailVerificationToken

Entité déjà codée : id, userId, tokenHash unique, expiresAt, usedAt, createdAt. Stocker le hash, pas le jeton transmis en clair. Usage unique, expiration et nettoyage à tester.

### Structure

id, userId unique, name, description, logoUrl nullable, website nullable, contactEmail, cityId, createdAt/updatedAt. **Structure désigne le prestataire**, pas l'établissement demandeur. contactEmail est privé et peut différer de l'email de connexion.

Pas de compte ou profil persistant obligatoire pour la structure demandeuse ; ses informations sont fournies dans la demande.

## 4. Activity et taxonomie

Activity conserve : id, structureId, title, description, format, cityId, budgetIndicative nullable, availabilityNote nullable, status, publishedAt nullable, createdAt/updatedAt.

- Formats : PRESENTIEL, DISTANCIEL, HYBRIDE.
- Statuts : BROUILLON, PUBLIEE, DEPUBLIEE.
- Publication : propriétaire actif et email vérifié, offre complète, thèmes/publics valides.
- Aucun minimum d'Intervenant et aucune validation de fiche individuelle.
- Champs requis proposés : titre, description, format, localisation de référence, au moins un thème et un public.
- Offre publiquement visible seulement si son statut et le compte propriétaire le permettent ; appliquer la règle aux détails, listes et contacts.
- Une suspension/anonymisation masque les offres immédiatement ; une réactivation ne republie pas les offres retirées sans action explicite.

Theme conserve notamment colorHex (déjà codé). Audience conserve minAge/maxAge (déjà codés), avec validation minAge ≤ maxAge. Les jointures ActivityTheme/ActivityAudience restent uniques par paire ; une valeur inactive n'est plus sélectionnable mais reste lisible sur les offres existantes.

## 5. Géographie : décision ouverte P-002

Le schéma actuel n'a qu'une ville par offre. Cela ne suffit pas à représenter un prestataire qui se déplace dans plusieurs départements.

**Proposition à valider** : couverture par départements au niveau de l'offre, via une jointure ActivityDepartment(activityId, departmentId), paire unique. Conserver la ville de référence séparément ; gérer explicitement les offres à distance sans fausse restriction au département du siège. L'UX doit distinguer offre sur place, déplacement et distanciel si cette proposition est retenue.

Avant E5/E6, préciser les cas de couverture nationale, hybride et d'accueil dans les locaux du prestataire. Ne pas coder ni migrer cette jointure sans validation. Carte/rayon kilométrique hors V1.

## 6. ContactRequest

Champs conservés : id, activityId, recipientStructureId, authorName, authorEmail, message, status, emailSentAt nullable, createdAt.

- recipientStructureId est calculé depuis Activity.structureId côté serveur ; ne pas faire confiance au destinataire envoyé par le navigateur.
- Les champs de structure/lieu/période/effectif souhaités restent des indications dans le message au MVP ; champs dédiés éventuels à cadrer séparément.
- La demande et son message sont persistés : **absence de conversation ne signifie pas absence de stockage**.
- Statuts actuels : ENVOYE, ECHEC_ENVOI. ENVOYE signifie transmission technique au service email, pas lecture, réponse ni réservation.
- Corriger lors de l'implémentation le défaut actuel ENVOYE : ne pas enregistrer un succès avant confirmation du service. Un état initial EN_ATTENTE_ENVOI est une option à cadrer dans E7, avec tests d'échec/reprise.
- Une demande ne peut cibler qu'une offre visible au moment de l'envoi.
- Aucun transfert de propriété d'activité dans la V1.

## 7. Modération et notifications

Report conserve authorUserId nullable, authorEmail requis si visiteur non connecté, targetType, targetId, reason, status, resolvedByUserId, resolutionNote, dates.

Cibles fonctionnelles V1 : STRUCTURE et ACTIVITY. Les anciennes références INTERVENANT restent à inventorier, pas à effacer aveuglément.

AdminAction conserve adminUserId, actionType, targetType, targetId, justification, createdAt. Actions actives : inscriptions, comptes, activités, signalements, taxonomie. Préserver l'historique des anciennes actions liées aux intervenants selon la politique de conservation revue.

Notification conserve userId, type, payload, readAt, emailSentAt et createdAt. Événements V1 : validation/rejet d'inscription, nouvelle demande, traitement de signalement. Les anciens types INTERVENANT_VALIDE/REJETE ne créent pas de nouveaux événements dans la cible ; traiter leur historique lors de R0.

## 8. Suppression et conservation

D-012 : suppression/anonymisation des données identifiantes, dépublication des offres, révocation des accès. Examiner également les tokens, payloads de notifications, messages, logos stockés et justifications libres ; modifier uniquement User.email ne suffit pas à qualifier l'ensemble des données d'anonyme.

D-032 mentionne historiquement deux ans pour les demandes et un audit illimité. **Cette politique doit être revue avant production**, avec finalités, catégories, durées et mécanisme de purge explicites. Ne pas la présenter comme une conformité acquise. Voir [sécurité](07-securite.md).

## 9. Plan de transition R0 — aucun script exécuté ici

1. Inventorier les environnements et les données : comptes réels/démonstration, structures, activités, intervenants, demandes, audits.
2. Vérifier qui propose réellement chaque offre. **Un ancien organisateur ayant accueilli une activité ne devient pas automatiquement son prestataire.**
3. Proposer un mapping approuvé des comptes/propriétaires ; laisser en brouillon ou non publiables les cas ambigus, sans envoyer de demandes au mauvais acteur.
4. Préparer une migration versionnée du rôle et les adaptations auth, permissions, routes, emails, tests et seed ; invalider les sessions incompatibles.
5. Supprimer l'obligation fonctionnelle du carnet. Conserver d'abord les tables/historiques si leur suppression n'est pas justifiée ; aucune perte de données implicite.
6. Tester sur copie appropriée ou données synthétiques, sauvegarde et procédure de retour documentées ; revue humaine obligatoire pour auth/RBAC.
7. Retirer les anciennes tables/valeurs seulement dans une migration séparée approuvée après analyse des dépendances et des données.

## 10. Risques et critères

Risque majeur : simple renommage de rôle qui attribue les offres au mauvais acteur. Alternative écartée : réinitialiser la base ou remplacer globalement les noms sans analyse.

- [ ] P-001 validée pour l'implémentation, P-002 arbitrée.
- [ ] Plan de migration explicite et données préservées.
- [ ] Tests d'isolation, visibilité, statuts, destinataire et suppression.
- [ ] Aucun certificat de migration ou de sécurité délivré par cette seule révision documentaire.
