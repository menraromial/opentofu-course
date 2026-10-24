# Consignes du cours OpenTofu (source de vérité)

Demande de Romial du 2026-10-24, complétée par ses réponses sur le plan le même jour. Le plan
détaillé validé est dans `PLAN.md`.

## Ce qui est demandé

Un cours pour apprendre Terraform pas à pas avec OpenTofu, des bases jusqu'au niveau avancé,
utilisable avec n'importe quel fournisseur cloud. Tous les essais se font sur AWS et chaque
ressource créée est supprimée après l'essai. Le cours est un site Docusaurus, comme les autres
cours du dossier `docs/`.

## Public et voix

Personnes à l'aise avec un terminal Linux et Git, qui ont des notions de réseau (adresse IP,
port, DNS) et n'ont jamais écrit d'infrastructure en code. Voix d'un ingénieur qui enseigne : on
explique le mécanisme réel, on montre la commande, on lit la sortie.

## Façon de travailler

1. Un seul chapitre par réponse, dans l'ordre du plan ; « suite » = chapitre suivant. Un
   chapitre trop long est coupé en sous-parties, en disant où l'on s'arrête.
2. Les chapitres sont numérotés de 1 à 41 sans repartir à zéro ; chaque renvoi « ch. N » est un
   lien vers le chapitre (outil `tools/chapter_links.py`, relancé après chaque chapitre).
3. À la fin de chaque chapitre, commit et push sur `git@github.com:menraromial/opentofu-course.git`
   (branche `main`), ce qui publie le site sur GitHub Pages par le workflow Actions. Aucune
   attribution à Claude dans les commits.

## Langue

- La prose des pages est en français.
- Tout ce qui est nommé est en anglais : nom de l'application (Bookmarks), modules, ressources,
  variables, sorties, étiquettes, fichiers, dossiers, scripts, commentaires de code, commandes,
  composants et classes du site, mots-clés des encadrés.
- On ne parle jamais de « fil rouge » ; on dit « l'application Bookmarks » ou « l'application
  du cours ».
- Le vocabulaire anglais de l'outil (state, provider, backend, workspace) est gardé tel quel ;
  sa traduction française est donnée entre parenthèses à la première occurrence quand elle existe.

## Environnement technique

- OpenTofu 1.13.2 installé dans `~/.local/bin/tofu`. Terraform 1.16.1 est aussi présent sur le
  poste et sert de comparaison quand les deux outils divergent.
- AWS : profil CLI `cours`, région `eu-north-1`, compte personnel en plan gratuit. La session
  expire ; Romial la renouvelle avec `aws login --profile cours`.
- Seul AWS est disponible. Les autres fournisseurs n'apparaissent que dans l'encadré
  `:::cloud` (« Sur un autre cloud »), sous forme de tableau de ressources équivalentes, noms
  vérifiés dans la documentation du registre, sans code exécuté.
- Docker est disponible pour les chapitres sans cloud. Ne supprimer que ses propres conteneurs
  et images, par leur nom ; jamais de `docker ... prune`.

## Règles de test et de nettoyage

- Chaque commande, chaque fichier `.tf` et chaque sortie affichée dans une page viennent d'une
  exécution réelle (sorties raccourcies avec `...` si besoin). Le code des TP est publié dans
  `labs/chNN/` et testé tel qu'il est publié.
- Toute ressource AWS porte `course = "opentofu"` et `chapter = "NN"` (via `default_tags`).
- Chaque TP AWS se termine par `tofu destroy`, puis par `tools/check-cleanup.sh`, qui doit
  répondre qu'il ne reste rien. Je lance ce nettoyage moi-même après chaque validation.
- Avant une ressource facturée à l'heure (ALB, RDS, NAT), la page donne son coût horaire dans un
  encadré `:::cost`.

## Structure d'un chapitre

- Front matter : `part`, `chapter`, `title`, `sidebar_label`, `description`.
- Entrée directe dans le sujet, sans « dans le chapitre précédent » ni gabarit d'introduction.
- Explication du mécanisme réel, pas à pas, sans analogie avec la vie courante.
- Au moins une figure TikZ (`figures/src/*.tex`, style `figures/lib/tofu.sty`, palette
  `figures/palette.tsv`), suivie de deux ou trois phrases qui disent comment la lire.
- Manipulations intercalées dans le texte, au moment où la notion est introduite.
- Encadrés du cours : `:::trap` (erreur fréquente), `:::cost` (coût AWS), `:::cloud` (sur un
  autre cloud), `:::cleanup` (nettoyage), `:::summary` (fiche de révision).
- Fin de chapitre : erreurs fréquentes, exercices (3 questions de compréhension, 1 exercice
  pratique), corrigés détaillés, fiche de révision de 5 à 10 lignes.
- Sources en notes de bas de page pour tout fait daté, chiffré ou emprunté (documentation
  officielle d'OpenTofu et d'AWS en priorité).

## Règles d'écriture

Celles de `~/.claude/regles/ecriture-humaine/SKILL.md` et `~/.claude/regles/ponctuation/SKILL.md` :
pas de tiret cadratin, deux-points réservé à ses quatre emplois, pas de tics de texte généré,
chaque phrase porte une information propre au sujet.
