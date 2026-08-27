# EduConnect — Méthode de travail

## Objectif

Construire le produit par étapes documentées, avec critères d'acceptation et validation explicite. Le travail existant est conservé ; l'orientation produit évolue sans réinitialiser le projet.

## Règles

- Distinguer **décision utilisateur**, **exigence héritée maintenue**, **proposition à valider** et **état observé du code**.
- Une absence d'objection ne vaut pas une validation explicite.
- Amender la phase et [DECISIONS.md](DECISIONS.md) avant toute évolution fonctionnelle.
- Chaque phase précise objectif, contenu, risques/alternatives et critères de validation.
- Développer par épic après validation du périmètre concerné, sans calendrier artificiel (D-040).
- Le besoin produit est considéré établi (D-048) : pas d'enquête ni d'interviews obligatoires avant construction. Les tests d'usage du logiciel restent nécessaires.
- Une PR documentaire ne certifie pas que les fonctionnalités existent ni que leurs tests passent.
- Claude Code et Codex suivent les mêmes règles ; aucun agent ne fusionne une PR sans demande utilisateur.

## Historique des amendements

1. 2026-08-27 : cadrage initial, puis pivot vers le partage d'activités par des organisateurs (D-042 à D-046).
2. 2026-08-27 : confirmation explicite que **le prestataire proposant l'intervention publie et reçoit les demandes** (D-047). Les activités restent l'entrée de l'annuaire ; ce sont des offres, pas des retours d'expérience.
3. Présente révision : traduction documentaire de D-047. Les anciennes versions restent dans Git ; les décisions remplacées sont signalées dans le journal. Le code n'est pas migré.

## Statut des phases après réalignement

| Phase | Document | Statut |
|---|---|---|
| 1 | [Cadrage](01-cadrage-produit.md) | Orientation D-047/D-048 validée ; précisions à relire |
| 2 | [Spécifications](02-specifications-fonctionnelles.md) | Révision proposée P-001 |
| 3 | [MVP](03-mvp.md) | Révision proposée ; gratuité pilote héritée maintenue |
| 4 | [UX](04-ux.md) | Parcours révisés proposés ; design soigné maintenu |
| 5 | [Architecture](05-architecture-technique.md) | Stack conservée ; références obsolètes corrigées |
| 6 | [Données](06-modele-donnees.md) | Cible proposée ; migration non réalisée |
| 7 | [Sécurité](07-securite.md) | Exigences révisées ; revue avant production maintenue |
| 8 | [Dépôt](08-organisation-depot.md) | Conventions conservées ; écart de branche/CI signalé |
| 9 | [Backlog](09-backlog.md) | Ordre révisé proposé ; R0 avant nouveau code métier |
| 10 | Développement | Socle et comptes partiels observés, non revalidés ici |

Le fichier [10-modele-economique.md](10-modele-economique.md) est une note commerciale, pas une preuve de démarrage d'une nouvelle phase de développement.

## Validation suivante

Relire la traduction P-001 et arbitrer la géographie P-002 avant leurs implémentations. La monétisation P-003 se décide séparément : elle ne bloque pas le travail sur le pilote gratuit, mais bloque toute facturation ou promesse de formule.
