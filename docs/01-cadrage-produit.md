# Phase 1 — Cadrage produit

Statut : ✅ **Validée**

## 1. Objectif de la phase

Définir précisément ce qu'est EduConnect, pour qui, pourquoi, et où s'arrête son périmètre — avant toute spécification fonctionnelle. Ce document sert de référence commune ; il doit être stable une fois validé (les phases suivantes s'y réfèrent).

## 2. Proposition de vision

**EduConnect** est une plateforme de mise en relation entre :
- des **structures qui proposent des interventions pédagogiques** (ex. associations, indépendants, entreprises culturelles/scientifiques, artistes, professionnels souhaitant intervenir en milieu scolaire ou périscolaire) — appelées ici **Intervenants**,
- et des **structures qui recherchent une intervention** pour leur public (écoles, collèges/lycées, centres de loisirs, médiathèques, structures périscolaires, associations éducatives) — appelées ici **Organisateurs**.

La plateforme permet de publier une offre d'intervention (côté Intervenant) ou un besoin (côté Organisateur), de rechercher/filtrer, d'échanger, et de concrétiser une mise en relation (jusqu'à quel stade exactement = décision à trancher ci-dessous).

> ⚠️ Le nom "EduConnect" est repris tel quel du nom du dépôt. À confirmer ou changer en phase de branding (hors périmètre technique).

## 3. Problème adressé

Aujourd'hui, la mise en relation entre porteurs d'activités pédagogiques et établissements se fait de façon dispersée : bouche-à-oreille, réseaux personnels, appels d'offres informels, réseaux sociaux, annuaires génériques non spécialisés. Conséquences probables (à valider avec de vrais utilisateurs si possible) :
- Les intervenants de qualité peinent à se faire connaître au-delà de leur réseau local.
- Les organisateurs perdent du temps à chercher des intervenants adaptés (thématique, niveau, zone géographique, budget, disponibilité).
- Pas de moyen simple de comparer, évaluer la fiabilité, ou vérifier les habilitations (ex. agrément Éducation nationale, casier judiciaire vierge — sujet sensible, cf. section sécurité/risques).

## 4. Utilisateurs cibles

### 4.1 Persona "Intervenant" (offre)
Exemples : association d'éducation à l'environnement, planétarium itinérant, écrivain public, ancien sportif de haut niveau, musicien intervenant en milieu scolaire, entreprise de sensibilisation au numérique/handicap, etc.
Besoins probables : visibilité, gestion de son catalogue d'interventions, gestion de disponibilités, réception de demandes qualifiées, réputation/avis.

### 4.2 Persona "Organisateur" (demande)
Exemples : enseignant, directeur d'école, référent périscolaire, bibliothécaire, coordinateur d'association éducative.
Besoins probables : trouver rapidement un intervenant pertinent (thème, niveau scolaire, zone, budget, dates), comparer, contacter, organiser logistiquement, garder une trace administrative.

### 4.3 Rôle "Administrateur" — confirmé (cf. décision D3)
La plateforme intègre dès le MVP un **espace d'administration** destiné à une équipe interne (plusieurs comptes admin), avec au minimum :
- Validation manuelle des nouvelles structures (Intervenants et Organisateurs) avant publication de leur profil.
- Modération des fiches "mission"/offre et des signalements.
- Édition/correction des informations de mission et des comptes utilisateurs (droit de modifier au nom d'un utilisateur, ex. correction d'une erreur, mise en conformité).
- Gestion des comptes (suspension, réactivation, suppression).

*Le détail des permissions (rôle admin unique vs. sous-rôles type "modérateur"/"super-admin") sera précisé en phase Spécifications fonctionnelles.*

### 4.4 Rôle additionnel potentiel — hors MVP
- Un rôle **tutelle/collectivité** (ex. mairie, académie) qui référencerait ou financerait des interventions — optionnel, probablement hors MVP.

## 5. Périmètre proposé

### Dans le périmètre (vision produit globale, pas forcément le MVP)
- Inscription et gestion de profil pour les deux types de structures.
- Publication d'offres (côté Intervenant) et/ou de besoins (côté Organisateur) — cf. décision D1 ci-dessous.
- Recherche/filtrage (thématique, public visé, zone géographique, format, budget, disponibilité).
- Mise en relation : messagerie ou système de demande de contact.
- Fiche structure (présentation, historique, avis/évaluations).
- Notifications (nouvelle demande, nouveau message, etc.).

### Hors périmètre (explicitement, sauf décision contraire)
- Paiement en ligne / facturation intégrée (les modalités financières restent gérées hors plateforme, au moins au MVP).
- Signature électronique de convention.
- Vérification automatisée d'habilitations officielles (ex. interconnexion avec un système d'agrément académique) — trop lourd/risqué pour un MVP.
- Application mobile native (le MVP vise le web, responsive).
- Multi-langue (français uniquement au démarrage, sauf besoin exprimé).

## 6. Décisions — validées le 2026-08-27 (voir aussi `docs/DECISIONS.md`)

| # | Décision retenue |
|---|---|
| D1 | **Annuaire + messagerie**. Le modèle "appel à candidatures" est une évolution possible mais n'est pas exclu par le modèle de données. |
| D2 | **Gratuit au lancement.** Pas de paiement en ligne au MVP. Monétisation (abonnement/commission) réévaluée plus tard. |
| D3 | **Vérification manuelle avant publication + espace administrateur** dédié à la modération (validation des structures, gestion des signalements, édition des fiches "mission"/offre et des comptes utilisateurs). Un rôle **Administrateur** est donc confirmé dès le MVP, avec plusieurs comptes admin possibles (équipe de modération). |
| D4 | **Lancement en région pilote.** La zone géographique n'est pas codée en dur : c'est un filtre de recherche standard (région/département/ville). Le ciblage "région pilote" est une décision de mise sur le marché (communication, onboarding initial), pas une contrainte technique. Publics visés : scolaire + périscolaire (écoles, centres de loisirs, médiathèques, associations éducatives). *Le nom de la région pilote reste à préciser (marketing), non bloquant techniquement.* |
| D5 | **Messagerie interne uniquement** pour les échanges après mise en relation — pas de partage libre de coordonnées au MVP (assouplissement possible plus tard). |
| D6 | Nom "EduConnect" conservé à titre provisoire pour la suite du projet (non tranché explicitement, non bloquant). |

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
