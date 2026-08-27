# Phase 1 — Cadrage produit

Statut : ✅ **Validée** (amendée le 2026-08-27)

> **Amendement du 2026-08-27 (pivot de modèle)** : le modèle initial ("Intervenants" publiant des offres, "Organisateurs" recherchant et contactant) est remplacé par un modèle **annuaire d'activités**. Chaque **Organisateur** crée et publie ses propres **activités pédagogiques**, et doit déclarer pour chacune **au moins un Intervenant** — une fiche de référence (nom, structure, contact) gérée par l'Organisateur dans un espace dédié, **sans compte ni connexion propre**. Il n'y a donc plus que **deux rôles de compte : Organisateur et Administrateur**. Voir §2, §4, §6 (révisés) et `docs/DECISIONS.md` (D-042 à D-045).

## 1. Objectif de la phase

Définir précisément ce qu'est EduConnect, pour qui, pourquoi, et où s'arrête son périmètre — avant toute spécification fonctionnelle. Ce document sert de référence commune ; il doit être stable une fois validé (les phases suivantes s'y réfèrent).

## 2. Proposition de vision *(révisée le 2026-08-27)*

**EduConnect** est un **annuaire d'activités pédagogiques**. Des **Organisateurs** (écoles, collèges/lycées, centres de loisirs, médiathèques, structures périscolaires, associations éducatives) y publient les **activités** qu'ils organisent (ateliers, interventions, projets pédagogiques), en déclarant pour chacune **au moins un Intervenant** — la personne ou structure qui a effectivement mené l'activité (association, indépendant, entreprise culturelle/scientifique, artiste, professionnel...).

L'Intervenant n'est **pas un utilisateur du site** : c'est une fiche de référence (nom, structure, description, contact) que l'Organisateur crée et gère dans un espace dédié ("mes intervenants"), réutilisable d'une activité à l'autre. La plateforme permet à tout visiteur de consulter l'annuaire des activités publiées, de rechercher/filtrer, et de **contacter l'Organisateur** qui a publié une activité (ex. pour en savoir plus, s'en inspirer, ou entrer en contact avec l'intervenant déclaré).

> ⚠️ Le nom "EduConnect" est repris tel quel du nom du dépôt. À confirmer ou changer en phase de branding (hors périmètre technique).

## 3. Problème adressé *(révisé le 2026-08-27)*

Aujourd'hui, les activités pédagogiques menées par les établissements et structures éducatives (interventions, ateliers, projets) restent largement invisibles au-delà de leur propre structure : pas de recensement partagé, pas de moyen simple pour une autre structure de s'en inspirer ou de retrouver un intervenant qui a fait ses preuves ailleurs. Conséquences probables (à valider avec de vrais utilisateurs si possible) :
- Les bonnes pratiques et activités réussies restent cantonnées à un réseau local, sans visibilité pour d'autres structures qui gagneraient à les reproduire.
- Les Organisateurs qui cherchent à monter un projet similaire repartent de zéro plutôt que de s'appuyer sur ce qui a déjà été fait ailleurs.
- Pas de moyen simple de retrouver un intervenant recommandé par une autre structure, ni de comparer les activités menées sur un territoire.

## 4. Utilisateurs cibles *(révisé le 2026-08-27 — deux rôles de compte seulement)*

### 4.1 Persona "Organisateur" (seul rôle de compte "métier")
Exemples : enseignant, directeur d'école, référent périscolaire, bibliothécaire, coordinateur d'association éducative.
Besoins probables : publier les activités qu'il organise, gérer un carnet réutilisable d'intervenants (créer/éditer une fiche intervenant), donner de la visibilité à son établissement/ses projets, être contacté par d'autres structures intéressées.

### 4.2 "Intervenant" — fiche de référence, pas un compte
L'Intervenant (ex. association d'éducation à l'environnement, planétarium itinérant, écrivain public, musicien intervenant en milieu scolaire...) est **déclaré par l'Organisateur** sur chaque activité, via une fiche qu'il crée et peut réutiliser. Il n'a ni identifiant ni accès à la plateforme. Ces fiches sont modérées par un Administrateur avant de pouvoir être associées à une activité publiée (cf. D3 révisée, §6).

### 4.3 Rôle "Administrateur" — confirmé (cf. décision D3)
La plateforme intègre dès le MVP un **espace d'administration** destiné à une équipe interne (plusieurs comptes admin), avec au minimum :
- Validation manuelle des nouveaux comptes Organisateur avant publication de leur profil.
- Validation manuelle des fiches Intervenant créées par les Organisateurs, avant qu'elles ne puissent être associées à une activité publiée.
- Modération des activités publiées et des signalements.
- Édition/correction des informations d'activité, de fiche Intervenant et des comptes Organisateur (droit de modifier au nom d'un utilisateur, ex. correction d'une erreur, mise en conformité).
- Gestion des comptes (suspension, réactivation, suppression).

*Le détail des permissions (rôle admin unique vs. sous-rôles type "modérateur"/"super-admin") sera précisé en phase Spécifications fonctionnelles.*

### 4.4 Rôle additionnel potentiel — hors MVP
- Un rôle **tutelle/collectivité** (ex. mairie, académie) qui référencerait ou financerait des interventions — optionnel, probablement hors MVP.

## 5. Périmètre proposé

### Dans le périmètre (vision produit globale, pas forcément le MVP)
- Inscription et gestion de profil pour les Organisateurs.
- Gestion d'un carnet d'Intervenants (fiches réutilisables) par l'Organisateur.
- Publication d'activités par l'Organisateur, chacune déclarant au moins un Intervenant validé — cf. décision D1 révisée ci-dessous.
- Recherche/filtrage (thématique, public visé, zone géographique, format, budget, disponibilité).
- Mise en relation : contact de l'Organisateur qui a publié une activité.
- Fiche structure (présentation, historique, avis/évaluations).
- Notifications (nouvelle demande, etc.).

### Hors périmètre (explicitement, sauf décision contraire)
- Paiement en ligne / facturation intégrée (les modalités financières restent gérées hors plateforme, au moins au MVP).
- Signature électronique de convention.
- Vérification automatisée d'habilitations officielles (ex. interconnexion avec un système d'agrément académique) — trop lourd/risqué pour un MVP.
- Application mobile native (le MVP vise le web, responsive).
- Multi-langue (français uniquement au démarrage, sauf besoin exprimé).

## 6. Décisions — validées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D1 | *(révisée le 2026-08-27)* **Annuaire d'activités.** Chaque Organisateur publie ses propres activités, chacune déclarant au moins un Intervenant (fiche sans compte). Le contact se fait vers l'Organisateur. Remplace le modèle initial "Intervenants publient des offres, Organisateurs contactent" — voir D-042. |
| D2 | **Gratuit au lancement.** Pas de paiement en ligne au MVP. Monétisation (abonnement/commission) réévaluée plus tard. |
| D3 | *(révisée le 2026-08-27)* **Vérification manuelle avant publication + espace administrateur** dédié à la modération : validation des comptes Organisateur **et** des fiches Intervenant, gestion des signalements, édition des activités et des comptes. Un rôle **Administrateur** est confirmé dès le MVP, avec plusieurs comptes admin possibles (équipe de modération). |
| D4 | **Lancement en région pilote.** La zone géographique n'est pas codée en dur : c'est un filtre de recherche standard (région/département/ville). Le ciblage "région pilote" est une décision de mise sur le marché (communication, onboarding initial), pas une contrainte technique. Publics visés : scolaire + périscolaire (écoles, centres de loisirs, médiathèques, associations éducatives). *Le nom de la région pilote reste à préciser (marketing), non bloquant techniquement.* |
| D5 | *(révisée le 2026-08-27)* **Contact via l'Organisateur** qui a publié l'activité (email), et non plus une messagerie interne entre deux comptes — cohérent avec le retrait de la messagerie du MVP (déjà acté en D-030) et le fait que l'Intervenant n'a pas de compte à contacter directement. |
| D6 | Nom "EduConnect" conservé à titre provisoire pour la suite du projet (non tranché explicitement, non bloquant). |
| D7 | *(obsolète depuis le 2026-08-27)* Le cumul de rôles Intervenant/Organisateur n'a plus d'objet : il n'existe plus qu'un seul rôle de compte "métier" (Organisateur). Voir D-043. |

### Détail des options envisagées (archive)

### D1 — Modèle de mise en relation
Comment se fait la rencontre offre/demande ?
- **Option A (recommandée pour un MVP) — Annuaire + messagerie** : les Intervenants publient des fiches/offres, les Organisateurs recherchent et contactent directement via une messagerie interne. Simple, rapide à livrer, valeur immédiate.
- **Option B — Système d'appel à candidatures** : les Organisateurs publient un besoin précis (date, thème, budget), les Intervenants y répondent (comme un appel d'offres). Plus structurant mais plus complexe (statuts de candidature, sélection, etc.).
- **Option C — Les deux, en parallèle** : plus complet mais complexifie fortement le MVP et l'UX.

*Recommandation : démarrer en Option A, prévoir l'Option B comme évolution (le modèle de données devra a minima ne pas l'exclure).*

### D2 — Modèle économique
Qui paie, et pour quoi ?
- Gratuit pour tous au lancement (acquisition d'utilisateurs) ?
- Abonnement Intervenants (visibilité) ?
- Commission sur mise en relation réalisée ?
- Financement par des tiers (collectivités, académies) ?

*Impact direct sur le modèle de données (facturation, statuts d'abonnement) et sur la sécurité (paiement). À trancher au moins par une intention de direction, même si l'implémentation est hors MVP.*

### D3 — Vérification / confiance
Quel niveau de vérification des structures à l'inscription ?
- Aucune vérification au MVP (déclaratif) + modération a posteriori (signalement) ?
- Vérification manuelle par un admin avant publication (email pro, SIRET, etc.) ?
- Vérification renforcée (habilitations, antécédents) — probablement hors MVP, sujet réglementaire sensible (public mineur).

*Recommandation : déclaratif + modération a posteriori au MVP, avec un champ "structure vérifiée" (booléen géré par admin) pour amorcer la confiance sans bloquer l'onboarding.*

### D4 — Portée géographique et publics visés
- Périmètre géographique de lancement (France entière ? une région pilote ?).
- Public des interventions : uniquement scolaire (maternelle → lycée) ou aussi périscolaire/associatif/loisirs ?

### D5 — Canal de mise en relation finale
Une fois le contact établi, tout reste-t-il dans la plateforme (messagerie interne uniquement) ou peut-on échanger coordonnées externes (email/téléphone) librement ?
- Impacte la modération, la sécurité (protection des données, anti-abus) et la valeur perçue de la plateforme (rétention).

### D6 — Nom et identité produit
"EduConnect" est-il définitif ? (Non bloquant techniquement mais impacte la doc, le repo, éventuellement un domaine.)

## 7. Risques identifiés (niveau cadrage)

| Risque | Probabilité | Impact | Mitigation envisagée |
|---|---|---|---|
| Public mineur impliqué indirectement (interventions en milieu scolaire) → exigences légales renforcées (RGPD, protection de l'enfance, éventuellement vérification d'honorabilité) | Élevée | Élevé | Ne jamais collecter de données sur des mineurs directement sur la plateforme ; cadrer explicitement en phase Sécurité ; avertissement clair que la plateforme ne remplace pas les vérifications légales obligatoires côté établissement |
| Ambiguïté du modèle (annuaire vs appel d'offres) qui gonfle le MVP | Moyenne | Élevé | Trancher D1 avant la phase Spécifications |
| Absence de modèle économique clair bloque des choix techniques (facturation, quotas) | Moyenne | Moyen | Trancher au moins une intention en D2, quitte à la différer techniquement |
| Confusion des rôles (un compte peut-il être à la fois Intervenant et Organisateur ?) | Moyenne | Moyen | Trancher explicitement en phase Spécifications, mais noter l'intention ici |
| Périmètre qui s'étend en cours de route ("scope creep") faute de MVP strict | Élevée si non cadré | Élevé | Phase 3 (MVP) dédiée, avec critères d'exclusion explicites |

## 8. Alternatives de positionnement envisagées et écartées (à ce stade)

- **Place de marché avec paiement intégré dès le départ** : écarté pour le MVP — trop de complexité réglementaire (statut d'intermédiaire financier, KYC) pour un premier lancement ; réévaluable plus tard (D2).
- **Réseau social généraliste pour l'éducation** : écarté — hors sujet, dilue la proposition de valeur (mise en relation ciblée offre/demande).
- **Outil interne à une seule académie/collectivité** : écarté par défaut sauf si l'utilisateur précise un client institutionnel unique — la vision par défaut est une plateforme ouverte multi-structures.

## 9. Question ouverte pour l'utilisateur

Avant de valider cette phase, merci de trancher (ou de confirmer les recommandations) sur **D1 à D6**. Une fois validées, ces décisions sont copiées dans `docs/DECISIONS.md` et servent de socle intangible pour la Phase 2 (Spécifications fonctionnelles).

## 10. Critères de validation de la phase

- [x] D1 à D6 tranchés (au moins une intention claire, même provisoire).
- [x] Vision, problème, personas jugés fidèles par l'utilisateur.
- [x] Périmètre in/out validé (ajout du rôle Administrateur / espace de modération suite à D3).
- [x] Risques jugés complets à ce stade (ajouts possibles en phase 2).

**Phase 1 validée le 2026-08-27.** → Passage à la Phase 2 (Spécifications fonctionnelles).

**Amendement validé le 2026-08-27** (pivot annuaire d'activités, deux rôles Organisateur/Admin) — voir bandeau en tête de document et `docs/DECISIONS.md` D-042 à D-045. Répercuté dans les Phases 2, 3, 4, 6, 7, 8, 9.
