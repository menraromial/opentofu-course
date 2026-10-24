import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// One category per part; each finished chapter is added here right away
// and gets its page id in src/components/parts.ts.
const sidebars: SidebarsConfig = {
  course: [
    'index',
    {
      type: 'category',
      label: 'Partie 0 · Avant de commencer',
      collapsed: false,
      link: {type: 'doc', id: 'part-0/index'},
      items: ['part-0/infrastructure-as-code'],
    },
    {
      type: 'category',
      label: 'Partie 1 · Le langage et le moteur',
      collapsed: false,
      link: {type: 'doc', id: 'part-1/index'},
      items: ['part-1/first-project'],
    },
  ],
};

export default sidebars;
