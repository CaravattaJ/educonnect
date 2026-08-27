# Phase 7 — Sécurité

Statut : 🟡 **En attente de validation**

Ce document précise les exigences de sécurité et de conformité applicables au MVP, en s'appuyant sur le modèle de données (Phase 6) et l'architecture (Phase 5). Point d'attention particulier : la plateforme met en relation des structures dont les interventions peuvent avoir lieu **auprès de mineurs** (établissements scolaires, périscolaire) — cf. risque déjà identifié en Phase 1 §7.

## 1. Objectif de la phase

Fixer les mesures de sécurité et de conformité non négociables avant le développement (Phase 10), et documenter clairement les limites de responsabilité de la plateforme (notamment sur la vérification des intervenants), pour éviter toute ambiguïté juridique et produit.

## 2. Périmètre de responsabilité — point critique

**EduConnect n'est pas et ne se substitue pas à un dispositif de vérification d'habilitation à intervenir auprès de mineurs** (ex. agrément Éducation nationale, extrait de casier judiciaire B2/B3, contrôle d'honorabilité). La vérification effectuée par la plateforme (D3) porte sur l'**existence et le sérieux déclaratif de la structure** (identité, cohérence des informations), pas sur une habilitation légale à intervenir auprès d'enfants.

- Cette limite doit être **explicite et visible** : mentions légales, CGU, et rappel contextuel au moment de la mise en relation ("Il appartient à l'Organisateur de vérifier les habilitations requises pour toute intervention auprès de mineurs").
- Aucune donnée de mineur n'est collectée par la plateforme (ni élèves, ni listes de classes) — seules des structures/professionnels s'inscrivent.
- Ce point n'est pas qu'une formalité juridique : il conditionne la confiance dans le produit et doit être traité comme une exigence produit de premier plan, pas une simple ligne de CGU (cf. décision D33).

## 3. Authentification et gestion des comptes

- Mots de passe : hachage **argon2id** (ou bcrypt à défaut, si la librairie d'auth choisie ne supporte qu'argon2/bcrypt — cf. Phase 5, Auth.js), jamais stocké ni loggé en clair.
- Politique de mot de passe : longueur minimale raisonnable (12 caractères) plutôt que des règles de complexité artificielles (recommandation NIST actuelle), vérification contre une liste de mots de passe compromis courants si la librairie le permet.
- Protection anti-bruteforce sur la connexion : limitation du nombre de tentatives par compte/IP (ex. verrouillage temporaire progressif), cf. décision D31 (captcha).
- OAuth Google (D14) : aucune donnée de mot de passe stockée pour ces comptes ; validation de l'email retourné par Google avant association à un compte existant (éviter la prise de contrôle de compte via un email non vérifié).
- Sessions : cookies de session sécurisés (`HttpOnly`, `Secure`, `SameSite=Lax` ou `Strict`), expiration raisonnable, révocation possible (déconnexion globale) en cas de suspicion.
- Changement de mot de passe / réinitialisation : lien à usage unique, expirant rapidement, envoyé uniquement à l'email vérifié du compte.

## 4. Autorisation et contrôle d'accès

- **RBAC strict** basé sur `User.role` (Phase 6) : chaque route/API vérifie explicitement le rôle attendu, jamais une simple vérification côté interface (le contrôle serveur fait foi).
- **Contrôle de propriété** : un Intervenant ne peut éditer/dépublier que ses propres `MissionListing` (vérification `structureId` = structure de l'utilisateur courant sur chaque opération d'écriture), pas seulement un contrôle de rôle générique.
- **Statut de compte vérifié à chaque action sensible** : un compte `SUSPENDU` ou `EN_ATTENTE` ne peut pas publier de fiche ni envoyer de demande de contact, même si le token de session est valide (vérification à chaque requête, pas seulement à la connexion).
- **Accès admin** : les routes d'administration sont isolées (préfixe dédié), protégées par le rôle `ADMIN`, avec una journalisation systématique via `AdminAction` (Phase 6 §3.8) — aucune action admin sensible sans entrée d'audit correspondante.
- Pas de création de compte admin par auto-inscription : un compte `ADMIN` est créé manuellement (script/accès direct base) ou par un admin existant, jamais via le formulaire public.

## 5. Protection des données personnelles (RGPD)

- **Base légale** : exécution du service demandé par l'utilisateur (inscription, mise en relation) pour les données de compte/profil ; intérêt légitime encadré pour la modération.
- **Minimisation** : ne collecter que les champs nécessaires au fonctionnement (Phase 6) ; pas de champ superflu (ex. pas de date de naissance, pas de numéro de téléphone personnel obligatoire).
- **Consentement** : case à cocher explicite (non pré-cochée) à l'inscription pour la politique de confidentialité ; pas de consentement implicite.
- **Droit d'accès/rectification** : accessible depuis l'espace "Paramètres du compte" (Phase 4 §2).
- **Droit à l'effacement** : anonymisation à la demande (D12, Phase 6 §4.2), traitée sous un délai raisonnable (recommandation : 30 jours max, conforme RGPD).
- **Durée de conservation** : cf. décision D32.
- **Registre des traitements** : document à tenir à jour (hors périmètre technique direct, mais à initier dès le lancement — responsabilité produit/organisationnelle).
- **Hébergement UE** : confirmé par le choix d'hébergeur/région en Phase 5 (§7, risque identifié) — à vérifier explicitement au moment de la configuration effective (Phase 10).
- **Cookies** : uniquement des cookies strictement nécessaires (session) au MVP (pas d'analytics tiers avec cookies de tracking sans consentement) — si un outil d'analytics est ajouté plus tard, prévoir un bandeau de consentement (hors périmètre MVP, Phase 3).

## 6. Lutte contre les abus et le spam

- **Formulaire de contact (`ContactRequest`, D30)** : throttling applicatif (ex. limite de N demandes par compte Organisateur par heure/jour), et par IP pour limiter la création de comptes automatisée à des fins de spam.
- **Inscription** : vérification d'email (lien de confirmation) avant activation complète du compte (même si le compte reste `EN_ATTENTE` de validation admin en parallèle) ; cf. décision D31 pour un éventuel captcha.
- **Signalement (`Report`)** : pas de limite de signalement légitime, mais surveillance des faux signalements en masse (traçabilité par `authorUserId`, un admin peut identifier un pattern abusif).
- **Contenu des fiches/profils** : pas d'exécution de contenu utilisateur (pas de HTML riche/scripts) — texte simple avec échappement systématique à l'affichage (protection XSS de base, cf. §7).

## 7. Sécurité applicative générale

- **Validation des entrées** : toute donnée entrante (formulaires, API) validée côté serveur avec un schéma strict (ex. Zod, cohérent avec TypeScript), jamais une confiance aveugle dans la validation côté client.
- **Protection XSS** : pas de rendu HTML brut de contenu utilisateur ; échappement systématique (comportement par défaut de React/Next.js, à ne jamais contourner avec `dangerouslySetInnerHTML` sur du contenu utilisateur).
- **Protection CSRF** : gérée nativement par les mécanismes de Next.js/Auth.js pour les formulaires et API mutantes (vérification d'origine).
- **Upload de fichiers (logo)** : restriction de type MIME (images uniquement), taille maximale, renommage du fichier stocké (pas de nom fourni par l'utilisateur conservé tel quel), pas d'exécution possible depuis le stockage de fichiers.
- **En-têtes de sécurité HTTP** : `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` — cf. décision D34 pour le niveau de rigueur au MVP.
- **Dépendances** : mise à jour régulière, alertes automatiques sur vulnérabilités connues (ex. Dependabot/GitHub Advisories), pas de dépendance non maintenue pour un composant sensible (auth, upload).
- **Secrets** : jamais commités dans le dépôt (variables d'environnement gérées par l'hébergeur — Vercel — et non versionnées), rotation possible des secrets OAuth/API en cas de compromission suspectée.

## 8. Disponibilité et sauvegarde

- **Sauvegardes base de données** : sauvegardes automatiques régulières côté hébergeur managé (Neon/Supabase, Phase 5), avec une politique de rétention minimale — cf. décision D35.
- **Plan de reprise minimal** : restauration possible depuis une sauvegarde récente en cas d'incident ; pas d'exigence de réplication multi-région au MVP (cohérent avec Phase 3 §4, pas de haute disponibilité exigée).

## 9. Décisions à prendre pour valider cette phase

### D31 — Captcha sur les formulaires publics (inscription, contact)
- **Option A (recommandée)** : captcha discret (ex. Cloudflare Turnstile, respectueux de la vie privée, gratuit) sur l'inscription et le formulaire de contact, pour limiter les abus automatisés dès le MVP.
- **Option B** : pas de captcha au MVP, uniquement du throttling serveur ; ajout ultérieur si des abus sont constatés.

### D32 — Durées de conservation des données
- Compte anonymisé : conservation indéfinie des métadonnées anonymisées et du journal d'audit (`AdminAction`), ou purge après une durée définie (ex. 3 ans) ? **Recommandation : conservation indéfinie du journal d'audit** (nécessaire en cas de litige/récidive d'abus, données déjà anonymisées côté compte), à documenter dans la politique de confidentialité.
- `ContactRequest` : conservation pour une durée définie (ex. 2 ans) à des fins de preuve en cas de litige/abus, puis purge ou anonymisation complémentaire ?

### D33 — Formulation de la limite de responsabilité (§2)
- Confirmer l'approche : rappel explicite et visible (pas seulement en CGU) au moment de la publication d'une fiche et de l'envoi d'une demande de contact, du type "EduConnect ne vérifie pas les habilitations légales à intervenir auprès de mineurs — cette vérification relève de la responsabilité de l'Organisateur." Formulation exacte à valider avec un regard juridique si possible (hors périmètre technique).

### D34 — Rigueur des en-têtes de sécurité HTTP au MVP
- Configuration standard "raisonnable" par défaut (recommandée, ex. presets Next.js/Vercel + CSP basique) au MVP, avec durcissement itératif, ou audit de sécurité applicatif complet avant le tout premier lancement (plus long, plus coûteux) ?

### D35 — Politique de sauvegarde
- Fréquence/rétention des sauvegardes base de données au MVP : quotidienne avec rétention 7 jours (souvent le défaut des offres gratuites/premier palier des hébergeurs managés, recommandé) suffit-elle, ou faut-il une rétention plus longue dès le MVP ?

## 10. Risques identifiés (niveau sécurité)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Confusion des utilisateurs sur le niveau de vérification (croire que "structure validée" = "habilitée à intervenir auprès de mineurs") | Élevée si non traité explicitement | Élevé | Message explicite et récurrent (§2, D33), pas relégué aux seules CGU |
| Abus du formulaire de contact (spam, harcèlement) en l'absence de messagerie modérable en temps réel | Moyenne | Moyen | Throttling + captcha (D31) + signalement possible a posteriori |
| Compromission d'un compte admin (droits élevés) | Faible mais impact élevé | Élevé | Authentification admin avec les mêmes standards stricts que les autres comptes a minima ; envisager une exigence supplémentaire (ex. mot de passe fort obligatoire) sans bloquer le MVP par une 2FA complète (évolution possible) |
| Fuite de données via une sauvegarde ou un export mal sécurisé | Faible | Élevé | Accès aux sauvegardes restreint à l'hébergeur managé et à l'équipe technique, jamais de export en clair partagé hors canal sécurisé |

## 11. Alternatives envisagées et écartées

- **Authentification à deux facteurs (2FA) obligatoire dès le MVP pour tous les comptes** : écartée pour le MVP — ajoute de la friction à l'inscription pour un bénéfice de sécurité marginal à ce stade (pas de données financières) ; à réévaluer au minimum pour les comptes admin en évolution proche.
- **Vérification automatisée d'antécédents/habilitations** : écartée (cf. Phase 1 §5, hors périmètre) — techniquement et légalement lourde, hors de portée d'un MVP, et risquerait de laisser croire à une garantie que la plateforme ne peut pas offrir.
- **Chiffrement applicatif supplémentaire des champs en base (au-delà du chiffrement au repos standard de l'hébergeur managé)** : écarté au MVP — les données concernées ne sont pas des catégories particulières au sens RGPD (pas de données de santé, opinions, etc.), le chiffrement au repos standard de l'hébergeur est jugé suffisant.

## 12. Critères de validation de la phase

- [ ] D31 à D35 tranchées.
- [ ] Le point §2 (limite de responsabilité) est jugé suffisamment clair et sera repris tel quel dans l'UX (Phase 4, à amender si besoin) et les CGU.
- [ ] Mesures d'authentification/autorisation jugées adaptées au MVP.
- [ ] Risques jugés complets à ce stade.
