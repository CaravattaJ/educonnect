# EduConnect — Méthode de travail

Ce document décrit la façon dont le produit **EduConnect** est construit : par phases séquentielles, chacune validée explicitement avant de passer à la suivante. Objectif : éviter le prototypage improvisé, obtenir une base maintenable, testable et sécurisée.

## Principe

- Chaque phase produit un **livrable documentaire** dans `docs/`, numéroté dans l'ordre.
- Chaque livrable contient systématiquement :
  1. **Objectif de la phase**
  2. **Contenu / propositions**
  3. **Décisions à prendre** (avec options, une recommandation, et les compromis)
  4. **Risques identifiés** (probabilité / impact / mitigation)
  5. **Alternatives envisagées et écartées** (avec justification)
  6. **Critères de validation** (ce qui doit être tranché pour clore la phase)
- **Aucun code n'est écrit avant que le MVP (phase 3) soit validé.** Les phases 1-2 sont strictement documentaires.
- Une phase n'est considérée close que lorsque l'utilisateur donne une validation explicite (ou des corrections, auquel cas le document est amendé avant de repasser en validation).
- Les décisions validées sont consolidées dans `docs/DECISIONS.md` (journal des décisions, format ADR léger) au fur et à mesure — ce journal est la source de vérité pour les phases suivantes et pour Claude Code lors du développement.

## Séquence des phases

| # | Phase | Fichier | Statut |
|---|-------|---------|--------|
| 1 | Cadrage produit | `01-cadrage-produit.md` | ✅ Validée (2026-08-27) |
| 2 | Spécifications fonctionnelles | `02-specifications-fonctionnelles.md` | ✅ Validée (2026-08-27) |
| 3 | Définition du MVP | `03-mvp.md` | ✅ Validée (2026-08-27) |
| 4 | UX | `04-ux.md` | ✅ Validée (2026-08-27) |
| 5 | Architecture technique | `05-architecture-technique.md` | 🟡 En cours |
| 6 | Modèle de données | `06-modele-donnees.md` | ⏳ À venir |
| 7 | Sécurité | `07-securite.md` | ⏳ À venir |
| 8 | Organisation du dépôt | `08-organisation-depot.md` | ⏳ À venir |
| 9 | Backlog | `09-backlog.md` | ⏳ À venir |
| 10 | Développement itératif | `10-*` (un doc par itération) | ⏳ À venir |

## Règles de validation

- Je (Claude Code) ne commence jamais la phase N+1 tant que la phase N n'a pas reçu une validation explicite de l'utilisateur.
- Si une décision de phase N est remise en cause pendant une phase ultérieure, on revient amender le document de phase N et on met à jour `DECISIONS.md` plutôt que de laisser une incohérence silencieuse.
- Les commits Git ne portent que sur la documentation tant qu'on est en phase 1-9. Le premier commit de code applicatif n'intervient qu'après validation du backlog (phase 9) et démarrage de la phase 10.
