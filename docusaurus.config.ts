import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

const siteUrl = process.env.DOCUSAURUS_URL ?? 'https://development.altokepay.site';
const baseUrl = process.env.DOCUSAURUS_BASE_URL ?? '/';
const quickstartUrl = `${baseUrl}docs/v1/quickstart`;

const config: Config = {
  title: 'AltokePay Developer Docs',
  tagline: 'Contratos, arquitectura y guías de integración de AltokePay',
  favicon: 'img/favicon.ico',
  url: siteUrl,
  baseUrl,
  organizationName: 'Yeferson-gm',
  projectName: 'AltokePay',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  future: {
    v4: true,
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'v1',
              path: 'v1',
              banner: 'none',
              badge: true,
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: 'filename',
        language: ['es', 'en'],
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchBarPosition: 'right',
      },
    ],
  ],
  themeConfig: {
    image: 'img/altokepay-social.png',
    metadata: [
      {name: 'theme-color', content: '#087f5b'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    docs: {
      versionPersistence: 'localStorage',
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: false,
    },
    announcementBar: {
      id: 'client-api-v1-payer-identity',
      content: `<strong>Guías v1 actualizadas:</strong> integra Checkouts y Links de Pago con DNI o nombre completo · <a href="${quickstartUrl}">Ver inicio rápido</a>`,
      backgroundColor: '#faf7fc',
      textColor: '#30233a',
      isCloseable: true,
    },
    navbar: {
      title: 'AltokePay',
      logo: {
        alt: '',
        src: 'img/altokepay-wordmark.webp',
        width: 111,
        height: 37,
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'doc',
          docId: 'api/index',
          position: 'left',
          label: 'API',
        },
        {
          type: 'doc',
          docId: 'integration/index',
          position: 'left',
          label: 'Guías',
        },
        {
          href: 'https://github.com/Yeferson-gm/EJEMPLO-DE-INCORPORACION-DE-ALTOKEPAY',
          label: 'Ejemplo completo',
          position: 'left',
          className: 'navbar-github-example',
          'aria-label': 'Ejemplo completo de integración en GitHub',
        },
        {
          href: 'https://altokepay.site',
          label: 'Sitio web',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
          versions: {current: {label: 'v1'}},
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'AltokePay',
        src: 'img/altokepay-wordmark.webp',
        width: 144,
        height: 48,
      },
      links: [
        {
          title: 'Documentación',
          items: [
            {label: 'Introducción', to: '/docs/v1/intro'},
            {label: 'Arquitectura', to: '/docs/v1/architecture'},
            {label: 'Client API', to: '/docs/v1/api'},
          ],
        },
        {
          title: 'Integración',
          items: [
            {label: 'Guía de integración', to: '/docs/v1/integration'},
            {
              label: 'Ejemplo completo',
              href: 'https://github.com/Yeferson-gm/EJEMPLO-DE-INCORPORACION-DE-ALTOKEPAY',
            },
          ],
        },
        {
          title: 'AltokePay',
          items: [{label: 'Sitio web', href: 'https://altokepay.site'}],
        },
      ],
      copyright: `© ${new Date().getFullYear()} AltokePay. Documentación técnica.`,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'php'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
