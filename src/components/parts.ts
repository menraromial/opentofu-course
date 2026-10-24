// Course outline: single source for the home page, the chapter header and
// tools/chapter_links.py. A written chapter gets its page id ("doc"), which
// turns its title into a link on the home page. Detailed outline: PLAN.md.
export type Chapter = {num: number; title: string; doc?: string};
export type Part = {num: number; title: string; summary: string; chapters: Chapter[]};

export const PARTS: Part[] = [
  {
    num: 0,
    title: 'Avant de commencer',
    summary: 'Ce que l’infrastructure en code résout, d’où vient OpenTofu, et le poste de travail du cours.',
    chapters: [
      {num: 1, title: 'L’infrastructure en code', doc: 'part-0/infrastructure-as-code'},
      {num: 2, title: 'Installer l’environnement de travail'},
    ],
  },
  {
    num: 1,
    title: 'Le langage et le moteur, sans cloud',
    summary: 'HCL, variables, providers, state et graphe de dépendances, sur des ressources qui vivent sur le poste.',
    chapters: [
      {num: 3, title: 'Premier projet', doc: 'part-1/first-project'},
      {num: 4, title: 'La syntaxe HCL'},
      {num: 5, title: 'Variables, sorties et valeurs locales'},
      {num: 6, title: 'Les providers'},
      {num: 7, title: 'Le state'},
      {num: 8, title: 'Le graphe de dépendances'},
    ],
  },
  {
    num: 2,
    title: 'Un premier cloud, AWS',
    summary: 'Stockage, réseau et machines virtuelles sur AWS, répétition, expressions et cycle de vie des ressources.',
    chapters: [
      {num: 9, title: 'Le provider AWS et un premier bucket'},
      {num: 10, title: 'Le réseau'},
      {num: 11, title: 'Une machine virtuelle'},
      {num: 12, title: 'Répéter : count et for_each'},
      {num: 13, title: 'Expressions avancées'},
      {num: 14, title: 'Cycle de vie et garde-fous'},
    ],
  },
  {
    num: 3,
    title: 'Organiser le code',
    summary: 'Modules maison et publics, refactorisation sans destruction, structure d’un dépôt.',
    chapters: [
      {num: 15, title: 'Les modules'},
      {num: 16, title: 'Concevoir un bon module'},
      {num: 17, title: 'Utiliser les modules publics'},
      {num: 18, title: 'Refactoriser sans détruire'},
      {num: 19, title: 'Structurer un dépôt'},
    ],
  },
  {
    num: 4,
    title: 'Travailler à plusieurs',
    summary: 'State distant verrouillé et chiffré, environnements, composition de configurations, secrets.',
    chapters: [
      {num: 20, title: 'Le state distant'},
      {num: 21, title: 'Chiffrer le state'},
      {num: 22, title: 'Plusieurs environnements'},
      {num: 23, title: 'Composer des configurations'},
      {num: 24, title: 'Les secrets'},
    ],
  },
  {
    num: 5,
    title: 'Passer à l’échelle',
    summary: 'Répartiteur de charge, diffusion, plusieurs régions et comptes, données à protéger, coûts.',
    chapters: [
      {num: 25, title: 'Répartiteur de charge et mise à l’échelle'},
      {num: 26, title: 'Diffusion et DNS'},
      {num: 27, title: 'Plusieurs régions et plusieurs comptes'},
      {num: 28, title: 'Données et ressources sensibles à la destruction'},
      {num: 29, title: 'Maîtriser les coûts'},
    ],
  },
  {
    num: 6,
    title: 'Qualité, tests et automatisation',
    summary: 'Analyse statique, tofu test, politiques de sécurité, CI/CD avec GitHub Actions, plateformes d’orchestration.',
    chapters: [
      {num: 30, title: 'Analyse statique'},
      {num: 31, title: 'Tester avec tofu test'},
      {num: 32, title: 'Sécurité et politiques'},
      {num: 33, title: 'CI/CD avec GitHub Actions'},
      {num: 34, title: 'Plateformes d’orchestration'},
    ],
  },
  {
    num: 7,
    title: 'Vers l’expertise',
    summary: 'Indépendance du fournisseur, reprise de l’existant, incidents, mises à jour, fonctionnement interne, écrire un provider.',
    chapters: [
      {num: 35, title: 'Indépendance vis-à-vis du fournisseur'},
      {num: 36, title: 'Reprendre une infrastructure existante'},
      {num: 37, title: 'Dérive, incidents et réparations'},
      {num: 38, title: 'Mises à jour'},
      {num: 39, title: 'Sous le capot'},
      {num: 40, title: 'Écrire son propre provider'},
    ],
  },
  {
    num: 8,
    title: 'Projet final',
    summary: 'L’application Bookmarks complète, sur deux environnements, déployée puis détruite.',
    chapters: [{num: 41, title: 'Bookmarks en production'}],
  },
];

export function findPart(num?: number): Part | undefined {
  return num === undefined ? undefined : PARTS.find((p) => p.num === num);
}

export function chapterNumber(num: number): string {
  return String(num).padStart(2, '0');
}
