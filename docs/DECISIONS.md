# EduConnect — Journal des décisions (ADR léger)

Ce fichier consolide les décisions **validées** phase après phase. Chaque entrée est courte : contexte, décision, conséquences. Les options non retenues et le détail des arbitrages restent dans le document de phase correspondant.

Format :

```
## D-XXX — Titre
- Date :
- Phase :
- Décision :
- Conséquences :
```

---

## D-001 — Modèle de mise en relation
- Date : 2026-08-27
- Phase : 1 — Cadrage produit
- Décision : Modèle "annuaire + messagerie" : les Intervenants publient des fiches/offres, les Organisateurs recherchent et contactent directement via une messagerie interne.
- Conséquences : Le modèle de données doit rester ouvert à une évolution vers un système d'appel à candidatures, sans l'implémenter au MVP.

## D-002 — Modèle économique
- Date : 2026-08-27
- Phase : 1 — Cadrage produit
- Décision : Plateforme gratuite au lancement, pour tous les rôles. Pas de paiement en ligne au MVP.
- Conséquences : Pas de brique de facturation/paiement dans l'architecture MVP. Prévoir néanmoins un champ de statut de compte extensible (ex. `plan`) pour ne pas bloquer une monétisation future.

## D-003 — Vérification des structures et administration
- Date : 2026-08-27
- Phase : 1 — Cadrage produit
- Décision : Vérification manuelle par une équipe d'administration avant publication d'un profil. Un espace d'administration est livré dès le MVP, avec gestion des comptes admin (plusieurs comptes possibles), modération des structures/missions et droit d'édition sur les comptes et les fiches mission.
- Conséquences : Rôle `admin` obligatoire dans le modèle de données/permissions dès le MVP. Un flux d'inscription "en attente de validation" doit exister côté Intervenant et Organisateur. Impacts sécurité (droits élevés à protéger, traçabilité des actions admin — cf. phase Sécurité).

## D-004 — Portée géographique et publics
- Date : 2026-08-27
- Phase : 1 — Cadrage produit
- Décision : Lancement ciblé sur une région pilote (nom à préciser ultérieurement, décision marketing), mais sans restriction technique : la localisation est un filtre de recherche standard, pas une contrainte codée en dur. Publics visés : scolaire et périscolaire (écoles, centres de loisirs, médiathèques, associations éducatives).
- Conséquences : Le modèle de données doit inclure une notion de localisation structurée (région/département/ville) dès le MVP pour permettre le filtrage, même si la mise sur le marché reste régionale au départ.

## D-005 — Canal de mise en relation
- Date : 2026-08-27
- Phase : 1 — Cadrage produit
- Décision : Les échanges post mise-en-relation restent dans la messagerie interne de la plateforme (pas de partage libre de coordonnées au MVP).
- Conséquences : Une brique de messagerie interne (conversations liées à une mise en relation) est nécessaire dès le MVP ; prévoir modération/signalement des messages.

## D-006 — Nom du produit
- Date : 2026-08-27
- Phase : 1 — Cadrage produit
- Décision : "EduConnect" est conservé à titre provisoire. Non tranché définitivement, non bloquant pour la suite.
- Conséquences : Aucune, à date.

## D-007 — Cumul de rôles sur un compte
- Date : 2026-08-27
- Phase : 2 — Spécifications fonctionnelles
- Décision : Un compte a un type unique (Intervenant *ou* Organisateur). Décision retenue par défaut (option recommandée), le retour utilisateur n'ayant pas explicitement contesté ce point.
- Conséquences : Modèle de permissions simple (un rôle = un compte). À réévaluer si un besoin explicite de cumul apparaît en Phase 3 ou au-delà.

## D-008 — Avis / réputation
- Date : 2026-08-27
- Phase : 2 — Spécifications fonctionnelles
- Décision : Reporté après le MVP.
- Conséquences : Aucune brique de notation/avis dans le modèle de données du MVP.

## D-009 — Sous-rôles administrateur
- Date : 2026-08-27
- Phase : 2 — Spécifications fonctionnelles
- Décision : Rôle admin unique au MVP (pas de distinction Modérateur/Super-admin).
- Conséquences : Un seul rôle `admin` dans le modèle de permissions ; granularité plus fine réévaluable plus tard.

## D-010 — Taxonomie thématiques/publics
- Date : 2026-08-27
- Phase : 2 — Spécifications fonctionnelles
- Décision : Liste fermée, gérée par les administrateurs (pas de saisie libre par les Intervenants).
- Conséquences : Nécessite une interface d'administration pour gérer cette taxonomie dès le MVP ; impacte le modèle de données (table de référence).

## D-011 — Canaux de notification
- Date : 2026-08-27
- Phase : 2 — Spécifications fonctionnelles
- Décision : In-app + email dès le MVP.
- Conséquences : Nécessite un service d'envoi d'email transactionnel dans l'architecture (Phase 5).

## D-012 — Suppression de compte (RGPD)
- Date : 2026-08-27
- Phase : 2 — Spécifications fonctionnelles
- Décision : Anonymisation des données personnelles à la suppression, conservation des métadonnées de modération (signalements, actions admin).
- Conséquences : À détailler précisément en Phase 7 — Sécurité (quelles données sont anonymisées, durée de conservation des métadonnées).

## D-013 — Visibilité de l'annuaire
- Date : 2026-08-27
- Phase : 2 — Spécifications fonctionnelles
- Décision : Annuaire public consultable sans compte (données non sensibles uniquement). Seuls les comptes connectés et validés (statut "actif") peuvent créer une fiche mission ; les visiteurs sont strictement en lecture.
- Conséquences : Nécessite une distinction claire dans l'API/backend entre données publiques et données réservées aux comptes connectés (coordonnées de contact notamment, protégées derrière la messagerie interne, cf. D-005).

## D-014 — Méthode d'authentification
- Date : 2026-08-27
- Phase : 3 — Définition du MVP
- Décision : Email + mot de passe, et connexion via Google (SSO/OAuth), dès le MVP.
- Conséquences : La Phase 5 (Architecture) doit choisir une solution d'authentification supportant nativement email/mot de passe + OAuth Google (ex. Auth.js/NextAuth, Supabase Auth, Auth0, ou implémentation OAuth manuelle). Impact sécurité : gestion des secrets OAuth (Phase 7).

## D-015 — Limite de fiches mission
- Date : 2026-08-27
- Phase : 3 — Définition du MVP
- Décision : Aucun plafond au MVP.
- Conséquences : Aucune contrainte technique de quota dans le modèle de données au MVP.

## D-016 — Moteur de recherche
- Date : 2026-08-27
- Phase : 3 — Définition du MVP
- Décision : Recherche via la base de données relationnelle (pas de moteur dédié) au MVP.
- Conséquences : La Phase 5/6 doit néanmoins concevoir le modèle de données pour ne pas bloquer un remplacement ultérieur par un moteur dédié (ex. Meilisearch) si le volume augmente.

## D-017 — Délai de validation admin
- Date : 2026-08-27
- Phase : 3 — Définition du MVP
- Décision : Pas d'engagement de délai formel communiqué aux utilisateurs au MVP.
- Conséquences : Le délai de traitement des inscriptions reste suivi en interne comme métrique de vigilance (risque de goulot d'étranglement, cf. Phase 3 §7).

## D-018 — Outil de maquettage
- Date : 2026-08-27
- Phase : 4 — UX
- Décision : Pas de maquettes graphiques Figma avant le développement ; les wireframes textuels/structurels de `docs/04-ux.md` suffisent pour cadrer le développement.
- Conséquences : Le rendu visuel réel n'est validé qu'une fois le code écrit — mitigé par le choix d'un UI kit éprouvé (D-019) et une validation rapide des premiers écrans réels en itération 1.

## D-019 — UI kit
- Date : 2026-08-27
- Phase : 4 — UX
- Décision : Utilisation d'une bibliothèque de composants UI existante plutôt que du sur-mesure complet.
- Conséquences : Le choix précis (ex. shadcn/ui, MUI, Ant Design...) est fait en Phase 5 selon la stack technique retenue.

## D-020 — Registre de communication
- Date : 2026-08-27
- Phase : 4 — UX
- Décision : Vouvoiement, registre institutionnel et chaleureux pour tous les contenus (libellés, emails, messages d'erreur).
- Conséquences : Guide de contenu implicite pour toute rédaction de texte UI/emails dans les phases suivantes.
