# Cours OpenTofu : plan détaillé (proposition du 2026-10-24)

Public : à l'aise avec un terminal Linux et Git, notions de réseau (IP, port, DNS) ; jamais écrit
d'infrastructure en code. Objectif : écrire, tester, faire relire et déployer en équipe une
infrastructure complète avec OpenTofu, puis la transposer sur un autre fournisseur sans réapprendre
l'outil. Site Docusaurus dans `docs/opentofu`, un chapitre par réponse, dans l'ordre ; « suite » =
chapitre suivant. Numérotation continue d'une partie à l'autre pour les renvois (« voir ch. 12 »).
Publication sur GitHub Pages depuis le dépôt `menraromial/opentofu-course`, commit et push à la fin
de chaque chapitre.

Langue (décisions du 2026-10-24) : la prose des pages est en français ; tout ce qui est nommé est
en anglais, à savoir le nom de l'application, les modules, ressources, variables, sorties,
étiquettes, fichiers, dossiers, scripts, commentaires de code et commandes. On parle de
« l'application Bookmarks », jamais de « fil rouge ».

Version de référence : OpenTofu 1.13.2 (sortie le 2026-10-21), provider `hashicorp/aws` 6.x, à
figer dans une page « Versions utilisées ». Terraform 1.16 est aussi installé sur le poste : il
sert de point de comparaison dans les chapitres où les deux outils divergent.

## Principes qui rendent le cours indépendant du fournisseur

1. Le langage, le state, le graphe, les modules et les tests s'apprennent d'abord **sans cloud**
   (partie I), avec des providers qui tournent sur le poste : `local`, `random`, `tls`, `http`,
   `terraform_data` et `kreuzwerker/docker`. Rien n'y est propre à AWS.
2. AWS est le terrain de TP, pas le sujet. Chaque chapitre AWS sépare ce qui relève d'OpenTofu
   (valable partout) de ce qui relève du provider AWS (noms de ressources, authentification).
3. Seul AWS est disponible pour les TP (décision du 2026-10-24). Chaque chapitre AWS se termine
   donc par un encadré « Sur un autre cloud » qui donne, dans un tableau, les ressources
   équivalentes chez Azure (`azurerm`), Google Cloud (`google`) et un fournisseur européen
   (Scaleway ou OVHcloud), noms vérifiés dans la documentation du registre. Aucun code n'y est
   exécuté, et l'encadré le dit.
4. Le ch. 35 montre le motif « interface de module commune, implémentation par fournisseur » sur
   AWS et Docker, deux cibles réellement testées.

## Règles de TP sur AWS

- Profil CLI `cours`, région `eu-north-1` (Stockholm), compte personnel en plan gratuit.
- Toutes les ressources portent les étiquettes `course=opentofu` et `chapter=NN`, posées par
  `default_tags` dans le provider dès le ch. 9.
- Chaque TP se termine par `tofu destroy`, puis par un script de vérification
  (`tools/check-cleanup.sh`) qui interroge l'API Resource Groups Tagging et liste tout ce
  qui porte encore l'étiquette `course=opentofu`. Le TP n'est validé que si la liste est vide.
- Chaque commande et chaque sortie affichée dans une page vient d'une exécution réelle,
  raccourcie avec `...` si besoin.
- Pas de NAT Gateway ni de ressource facturée à l'heure laissée en place : quand un chapitre en a
  besoin (ALB, RDS), la page donne le coût horaire et le TP dure moins d'une heure.
- Alerte budgétaire AWS Budgets à 5 USD créée au ch. 2, avant le premier `apply`.

## L'application du cours : Bookmarks

Bookmarks est un service de signets (enregistrer, étiqueter et retrouver des liens), petit mais
réaliste. Son infrastructure grossit au fil des parties et donne une raison concrète à chaque
notion :

| Étape | Infrastructure | Chapitres |
|-------|----------------|-----------|
| 1 | page statique dans un bucket S3 | 9 |
| 2 | VPC à deux zones, une instance EC2 qui sert l'API (Python) | 10-14 |
| 3 | modules `network`, `compute`, `database` ; base PostgreSQL RDS | 15-19 |
| 4 | state distant chiffré, environnements `dev` et `prod` séparés | 20-24 |
| 5 | Auto Scaling Group derrière un ALB, CloudFront devant le bucket | 25-29 |
| 6 | pipeline CI/CD complet, tests, politiques | 30-33 |
| 7 | projet final : tout l'ensemble, multi-environnement, déployé puis détruit | 41 |

## Structure de chaque chapitre

Objectifs (3 à 5 lignes) ; explication du mécanisme réel, pas à pas ; figures TikZ adaptées au
thème clair/sombre (graphe de dépendances, cycle plan/apply, flux d'authentification, structure
du state) suivies de deux ou trois phrases de lecture ; manipulations intercalées dans le texte
avec sorties réelles ; encadré « Sur un autre cloud » (chapitres AWS) ; section « Nettoyage » ;
erreurs fréquentes ; exercices (3 questions, 1 exercice pratique) avec corrigés en fin de page ;
fiche de révision (5 à 10 lignes).

---

## Partie 0 : avant de commencer

### 1. L'infrastructure en code
Ce que l'on gérait à la main (console web, scripts shell) et ce qui casse : dérive entre
environnements, absence d'historique, impossibilité de relire un changement. Approche impérative
et approche déclarative, convergence vers un état désiré. Panorama situé précisément :
CloudFormation et Bicep (liés à un fournisseur), Pulumi (langage généraliste), Ansible (gestion de
configuration), Crossplane (contrôleurs Kubernetes). Histoire du fork : passage de Terraform sous
licence BSL 1.1 en août 2023, manifeste OpenTF, OpenTofu sous la Linux Foundation, première
version stable 1.6.0 en janvier 2024. Ce qui reste compatible avec Terraform et ce qui diverge.

### 2. Installer l'environnement de travail
Installation de `tofu` 1.13.2 (binaire dans `~/.local/bin`, vérification de la signature),
gestionnaire de versions `tenv`, extension OpenTofu pour VS Code. AWS CLI, profil `cours`,
connexion par `aws login`, vérification avec `aws sts get-caller-identity`. Utilisateur IAM ou
IAM Identity Center : ce que l'on choisit pour le cours et pourquoi. Alerte budgétaire, script de
vérification du nettoyage, convention d'étiquettes.

## Partie I : le langage et le moteur, sans cloud

### 3. Premier projet
Un fichier `main.tf` qui crée un fichier local et une chaîne aléatoire. Le cycle complet
`init`, `plan`, `apply`, `destroy`, lu ligne à ligne : ce que contient `.terraform/`, le fichier
`.terraform.lock.hcl`, le fichier `terraform.tfstate`. Les symboles `+`, `-`, `~`, `-/+` du plan.
Fichiers `.tf` et `.tofu` (priorité des seconds pour OpenTofu).

### 4. La syntaxe HCL
Blocs, étiquettes, arguments, attributs. Types primitifs et complexes (`list`, `set`, `map`,
`object`, `tuple`), conversions implicites. Références entre blocs, interpolation, heredoc,
commentaires. `tofu fmt`, `tofu validate`, `tofu console` pour expérimenter.

### 5. Variables, sorties et valeurs locales
Déclaration, types contraints, valeurs par défaut, `validation`, `sensitive`, `nullable`.
Les sept sources d'une variable et leur ordre de priorité (`-var`, fichiers `.tfvars`,
`*.auto.tfvars`, `TF_VAR_*`...). Outputs et `tofu output -json`. Locals pour nommer une
expression. Évaluation précoce des variables (OpenTofu 1.8) et ce qu'elle permet ensuite.

### 6. Les providers
Un provider est un programme séparé qui parle gRPC avec `tofu`. Adresse dans le registre
(`registry.opentofu.org/hashicorp/aws`), contraintes de version, fichier de verrouillage et ses
sommes de contrôle (améliorées en 1.12), cache de plugins, miroirs. Deuxième provider concret :
`kreuzwerker/docker` pour lancer un conteneur nginx local avec le même cycle qu'au ch. 3.

### 7. Le state
Pourquoi OpenTofu garde un état : correspondance entre adresses de ressources et identifiants
réels, attributs connus, dépendances, performances. Lecture du JSON, `serial` et `lineage`.
Rafraîchissement, dérive provoquée à la main sur le conteneur Docker, `plan -refresh-only`.
`tofu state list`, `show`, `mv`, `rm`, `pull`, `push` et les risques de chacune.

### 8. Le graphe de dépendances
Dépendances implicites par référence, `depends_on` et ses effets de bord, `tofu graph` rendu en
figure. Parcours du graphe, parallélisme (`-parallelism`), ordre inverse à la destruction.
Valeurs inconnues au moment du plan (`(known after apply)`) et pourquoi elles existent.

## Partie II : un premier cloud, AWS

### 9. Le provider AWS et un premier bucket
Chaîne de résolution des identifiants (variables d'environnement, profil, rôle assumé), région,
`default_tags`. Sources de données : `aws_caller_identity`, `aws_region`. Un bucket S3 qui
héberge la page statique de Bookmarks, accès public bloqué puis site web, sortie de l'URL.
Destruction d'un bucket non vide et `force_destroy`. Premier passage du script de vérification.

### 10. Le réseau
VPC, blocs CIDR, sous-réseaux publics et privés sur deux zones, table de routage, passerelle
Internet, groupes de sécurité. Construction ressource par ressource pour voir chaque objet AWS,
`cidrsubnet()` pour calculer les plages. Pourquoi le cours évite la NAT Gateway (coût horaire et
au gigaoctet) et ce que l'on fait à la place (sous-réseau public, points de terminaison VPC).

### 11. Une machine virtuelle
EC2 : AMI trouvée par source de données (`aws_ami` avec filtres), type d'instance, paire de clés
générée par `tls_private_key`, `user_data` produit par `templatefile()` qui installe l'API de
Bookmarks. Connexion SSH, puis Session Manager sans port ouvert. Provisioners (`remote-exec`,
`local-exec`) : ce qu'ils font, pourquoi la documentation les donne en dernier recours.

### 12. Répéter : `count` et `for_each`
Plusieurs sous-réseaux, plusieurs instances. Adresses `aws_subnet.public[0]` et
`aws_subnet.public["eu-north-1a"]`. Ce qui arrive quand on retire un élément au milieu d'une liste
avec `count` (démonstration du remplacement en cascade), clés stables avec `for_each`. Le
méta-argument `enabled` (1.11) pour une ressource conditionnelle.

### 13. Expressions avancées
Expressions `for` sur listes et maps, filtrage, regroupement, conditionnelle ternaire, splat,
blocs `dynamic` (règles de groupe de sécurité), fonctions utiles (`merge`, `lookup`, `try`,
`can`, `coalesce`, `flatten`, `setproduct`, `jsonencode`, `yamldecode`). Fonctions ajoutées en
1.13 pour réduire les valeurs inconnues au plan. Exercices dans `tofu console`.

### 14. Cycle de vie et garde-fous
Bloc `lifecycle` : `create_before_destroy`, `prevent_destroy` (dynamique depuis 1.12),
`ignore_changes`, `replace_triggered_by`, `destroy = false` (1.12). `tofu apply -replace`.
Préconditions et postconditions, blocs `check`. Démonstration : remplacer l'instance de Bookmarks
sans coupure.

## Partie III : organiser le code

### 15. Les modules
Module racine et modules enfants, entrées, sorties, appel, `tofu get`. Sources : chemin local,
Git avec référence, registre, S3, registre OCI (1.10). Extraction du réseau de Bookmarks dans un
module `network`.

### 16. Concevoir un bon module
Interface minimale, valeurs par défaut sûres, sorties utiles aux consommateurs, composition
plutôt qu'imbrication profonde, modules « enveloppes » à éviter. README généré par
`terraform-docs`, dossier `examples/`. Modules `compute` et `database` (RDS PostgreSQL), mot de
passe généré et gardé hors du code.

### 17. Utiliser les modules publics
Lire un module du registre avant de l'adopter (`terraform-aws-modules/vpc/aws`) : nombre de
variables, ressources réellement créées, mises à jour. Épingler une version, comparer avec le
module maison du ch. 15, critères de choix.

### 18. Refactoriser sans détruire
Renommer une ressource, la déplacer dans un module, passer de `count` à `for_each` sans
recréation : blocs `moved`. Reprendre une ressource créée à la console : blocs `import` (y compris
en boucle) et `tofu plan -generate-config-out`. Sortir une ressource de la gestion sans la
détruire : blocs `removed`. Ce qui reste du ressort de `tofu state mv`.

### 19. Structurer un dépôt
Découpage par composant et par environnement, nommage des fichiers (`versions.tf`,
`variables.tf`, `outputs.tf`...), conventions de nommage des ressources, taille d'un state et rayon
d'impact d'une erreur. Monodépôt ou dépôts séparés pour les modules. Restructuration du dépôt de
Bookmarks.

## Partie IV : travailler à plusieurs

### 20. Le state distant
Backend S3 : bucket versionné, chiffré, accès bloqué. Verrouillage natif par fichier
(`use_lockfile`, 1.10) et ancien verrouillage DynamoDB. Le problème de l'amorçage (le bucket du
state doit exister avant le state) et deux façons de le résoudre. Migration d'un state local
vers S3 avec `tofu init -migrate-state`. Verrou bloqué et `tofu force-unlock`.

### 21. Chiffrer le state
Ce que le state contient en clair (mots de passe RDS, clés privées), démonstration. Chiffrement
côté client propre à OpenTofu (1.7) : fournisseurs de clés (`pbkdf2`, `aws_kms`, fournisseurs
externes depuis 1.10), méthodes, chiffrement du plan, migration d'un state non chiffré, rotation de
clé, ce qui se passe si la clé est perdue.

### 22. Plusieurs environnements
Workspaces CLI et leurs limites, un répertoire par environnement, fichiers `.tfvars` par
environnement, configuration du backend partielle (`-backend-config`). Variables dans le bloc
`backend` grâce à l'évaluation précoce. Déploiement de Bookmarks en `dev` et en `prod`.

### 23. Composer des configurations
Lire les sorties d'une autre configuration : `terraform_remote_state` ou sources de données AWS
(par étiquette, par SSM Parameter Store). Couches réseau, données et application avec leurs
propres states et leur ordre de déploiement. Couplage introduit par chaque méthode.

### 24. Les secrets
Où les secrets fuient : `.tfvars` versionnés, state, plan, journaux de CI. `sensitive` et ses
limites. Valeurs éphémères et attributs en écriture seule (1.11) : mot de passe RDS qui ne
passe jamais par le state. Secrets Manager et SSM Parameter Store, variables éphémères.

## Partie V : passer à l'échelle

### 25. Répartiteur de charge et mise à l'échelle
Launch template, Auto Scaling Group sur deux zones, Application Load Balancer, groupe cible,
vérifications de santé. Remplacement progressif des instances (`instance_refresh`) quand
l'image change. Coût horaire de l'ALB et durée du TP.

### 26. Diffusion et DNS
CloudFront devant le bucket S3 (contrôle d'accès à l'origine), certificat ACM en `us-east-1`
(deuxième provider avec alias), Route 53 si un domaine est disponible, sinon domaine CloudFront.
Temps de propagation et effet sur `apply` et `destroy`.

### 27. Plusieurs régions et plusieurs comptes
Alias de provider, `for_each` sur les blocs `provider` (1.9) pour déployer la même pile dans
plusieurs régions, rôles assumés pour un second compte (ou simulation par rôle dans le même
compte). Passage de providers aux modules (`providers = {}`).

### 28. Données et ressources sensibles à la destruction
Snapshots RDS à la destruction, `deletion_protection`, buckets versionnés, `prevent_destroy`
dynamique selon l'environnement. Concilier « tout détruire après le TP » et « ne jamais détruire
la prod par erreur ».

### 29. Maîtriser les coûts
Estimation avant `apply` avec Infracost sur le plan JSON, étiquettes de répartition des coûts,
ressources piégeuses (NAT Gateway, adresses IPv4 publiques facturées, volumes EBS orphelins,
journaux CloudWatch sans rétention). Revue du coût de Bookmarks en `prod`.

## Partie VI : qualité, tests et automatisation

### 30. Analyse statique
`fmt` et `validate` en contrôle, TFLint avec le jeu de règles AWS, expérience de linting
intégrée à 1.13, hooks `pre-commit`. Ce que chaque outil détecte et ne détecte pas.

### 31. Tester avec `tofu test`
Fichiers `.tftest.hcl`, blocs `run`, assertions, mode `plan` et mode `apply`, destruction
automatique en fin de test. Tests unitaires de modules avec `mock_provider` et
`override_resource`, sans compte AWS. Tests d'intégration sur AWS : créer, appeler l'API de
Bookmarks, détruire.

### 32. Sécurité et politiques
Analyseurs de configuration (Trivy, qui a absorbé tfsec ; Checkov). Politiques en Rego avec
Conftest sur le plan JSON (`tofu show -json`) : interdire un bucket public, imposer les
étiquettes. Rôle IAM d'exécution au moindre privilège, construit à partir des appels réels.

### 33. CI/CD avec GitHub Actions
Fédération OIDC entre GitHub et AWS (aucune clé longue durée), `plan` sur chaque pull request
avec commentaire, plan sauvegardé en artefact, `apply` après fusion avec approbation. Sortie
lisible et JSON en même temps (`-json-into`, 1.12). Concurrence entre deux pipelines et verrou.

### 34. Plateformes d'orchestration
Ce qu'apportent Atlantis, Terrakube, Spacelift, env0 et Scalr par rapport à un pipeline maison
(file d'attente, politiques, détection de dérive, coûts). TP avec Atlantis en local relié au
dépôt de Bookmarks. Critères de choix.

## Partie VII : vers l'expertise

### 35. Indépendance vis-à-vis du fournisseur
Ce qui se transpose tel quel (langage, state, modules, tests, CI) et ce qui ne se transpose pas
(modèle IAM, réseau, noms de services). Motif d'interface commune : un module `web_service`
avec la même entrée et la même sortie, implémenté pour AWS (ECS Fargate) et pour Docker local,
testé sur les deux. Limites de l'abstraction multi-cloud et coût du plus petit dénominateur
commun.

### 36. Reprendre une infrastructure existante
Cas d'une infrastructure créée à la main (préparée par script au début du TP) : inventaire,
génération de configuration, imports en masse, nettoyage du code généré, premier plan vide.
Outils d'aide à l'inventaire et leurs limites.

### 37. Dérive, incidents et réparations
Détection de dérive planifiée en CI, `-refresh-only`, correction ou adoption. Restaurer une
version précédente du state depuis le versionnement S3, state corrompu, ressource fantôme,
`-target` et `-exclude` (1.9) en dernier recours et leurs dangers. Journalisation `TF_LOG`.

### 38. Mises à jour
Mettre à jour `tofu`, les providers et les modules : Renovate ou Dependabot, lecture des notes de
version, montée de version majeure du provider AWS (5 vers 6) sur Bookmarks. Migration d'un projet
Terraform vers OpenTofu et retour, avec le Terraform 1.16 installé sur le poste.

### 39. Sous le capot
Comment `tofu` construit et parcourt le graphe, protocole de plugin (gRPC, schémas, `PlanResourceChange`,
`ApplyResourceChange`), valeurs inconnues et marquées (sensibles, éphémères), format du plan
sauvegardé. Lecture d'une trace `TF_LOG=trace` d'un `apply`.

### 40. Écrire son propre provider
Provider minimal en Go avec le Terraform Plugin Framework pour une petite API HTTP locale
(par exemple l'API de Bookmarks) : schéma, CRUD, import, tests d'acceptation. Fonctions définies
par un provider (1.7). Publication dans un registre privé ou OCI.

## Partie VIII : projet final

### 41. Bookmarks en production
Cahier des charges : deux environnements, trois couches de state chiffrées, modules testés, CI
avec OIDC, politiques, estimation des coûts, documentation d'exploitation. Déroulé guidé avec
points de contrôle, déploiement complet, test de bout en bout, destruction et vérification.

## Annexes

- A. Aide-mémoire des commandes `tofu` et de leurs options.
- B. Tableau de transposition AWS, Azure, Google Cloud, Scaleway/OVHcloud.
- C. Différences entre OpenTofu et Terraform, version par version.
- D. Versions utilisées et procédure de nettoyage complète d'un compte de TP.
