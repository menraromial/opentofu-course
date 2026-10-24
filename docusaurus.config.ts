import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OpenTofu',
  tagline: 'Décrire son infrastructure en code, des bases au niveau avancé',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://menraromial.com',
  baseUrl: '/opentofu-course/',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    // footnotes hold the sources: French labels
    remarkRehypeOptions: {
      footnoteLabel: 'Sources et notes',
      footnoteBackLabel: 'Retour au texte',
    },
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'course',
          sidebarPath: './sidebars.ts',
          breadcrumbs: false,
          admonitions: {
            keywords: ['trap', 'cost', 'cloud', 'cleanup', 'summary'],
            extendDefaults: true,
          },
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/figures.css'],
        },
        // Figure SVGs are already prepared by figures/svgpost.py (colours as CSS
        // variables, prefixed ids): SVGO would merge ids across figures.
        svgr: {
          svgrConfig: {
            svgo: false,
          },
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['fr'],
        indexBlog: false,
        docsRouteBasePath: 'course',
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: false,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'OpenTofu',
      logo: {
        alt: '',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'course',
          position: 'left',
          label: 'Le cours',
        },
        {
          href: 'https://github.com/menraromial/opentofu-course',
          label: 'Code des TP',
          position: 'right',
        },
      ],
    },
    footer: {
      copyright: 'OpenTofu, cours de Romial Menra.',
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'hcl', 'json', 'python', 'yaml', 'diff', 'go'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
