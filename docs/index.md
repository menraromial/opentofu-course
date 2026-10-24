---
title: Comment le cours est construit
sidebar_label: Présentation
slug: /
label: Présentation
---

Ce cours apprend à décrire une infrastructure en code avec OpenTofu, le fork libre de Terraform. Il s’adresse à des personnes à l’aise avec un terminal Linux et avec Git, qui savent ce qu’est une adresse IP, un port ou un nom DNS, et qui n’ont jamais écrit d’infrastructure en code. À la fin, vous saurez écrire, tester, faire relire et déployer en équipe une infrastructure complète, et vous saurez ce qui changerait si elle devait tourner chez un autre fournisseur.

## L’ordre des parties

La partie 0 explique ce que l’infrastructure en code résout et installe le poste de travail. La partie 1 apprend le langage HCL, les providers, le state et le graphe de dépendances sur des ressources qui vivent sur votre machine (fichiers, clés, conteneurs Docker), sans compte cloud. La partie 2 passe à AWS avec le stockage, le réseau et les machines virtuelles, puis la partie 3 organise le code en modules. La partie 4 traite du travail à plusieurs (state partagé, verrouillé et chiffré, environnements, secrets), la partie 5 du passage à l’échelle, la partie 6 des tests, de la sécurité et de l’automatisation. La partie 7 va vers le fonctionnement interne d’OpenTofu et l’écriture d’un provider, et la partie 8 est un projet complet.

Les chapitres sont numérotés de 1 à 41 sans repartir à zéro à chaque partie, si bien qu’un renvoi comme « ch. 7 » désigne toujours le même chapitre.

## L’application Bookmarks

À partir du ch. 9, les chapitres construisent l’infrastructure d’une même application, Bookmarks, un petit service qui enregistre, étiquette et retrouve des liens. Elle commence comme une page statique dans un bucket S3 et finit sur deux environnements, derrière un répartiteur de charge, avec une base PostgreSQL, un réseau de diffusion et un pipeline de déploiement continu.

## Les travaux pratiques

Toutes les commandes et toutes les sorties affichées dans les pages viennent d’une exécution réelle, avec OpenTofu 1.13.2. Le code de chaque chapitre est publié dans le dossier [`labs`](https://github.com/menraromial/opentofu-course/tree/main/labs) du dépôt, tel qu’il a été testé.

Les TP cloud se font sur AWS, dans la région `eu-north-1`. Chaque ressource créée porte les étiquettes `course=opentofu` et `chapter=NN`, et chaque TP se termine par sa destruction, suivie du script `tools/check-cleanup.sh`, qui liste ce qui porte encore l’étiquette du cours. Un TP n’est terminé que si ce script ne trouve rien. Quand une ressource est facturée à l’heure, la page donne son coût avant de la créer.

## Les encadrés

:::trap
Une erreur fréquente, et ce qu’elle provoque.
:::

:::cost
Ce que coûte une ressource AWS pendant qu’elle tourne.
:::

:::cloud
Les ressources équivalentes chez d’autres fournisseurs (Azure, Google Cloud, Scaleway ou OVHcloud). Ces tableaux donnent des noms vérifiés dans la documentation des providers ; le code correspondant n’est pas exécuté dans le cours.
:::

:::cleanup
Les commandes qui suppriment tout ce que le TP a créé.
:::

Chaque chapitre se termine par les erreurs fréquentes, trois questions de compréhension, un exercice pratique, leurs corrigés et une fiche de révision.

## Conventions

Le texte est en français. Tout ce qui porte un nom dans le code est en anglais (ressources, variables, modules, fichiers, commentaires), comme dans la plupart des dépôts réels. Le vocabulaire de l’outil (*state*, *provider*, *backend*, *workspace*) est gardé tel quel, avec sa traduction entre parenthèses à la première occurrence. Ce qui est dit pour OpenTofu vaut pour Terraform en remplaçant `tofu` par `terraform`, sauf mention contraire : les fonctions propres à OpenTofu sont signalées là où elles apparaissent. Les faits datés ou chiffrés renvoient à leur source en note de bas de page.
