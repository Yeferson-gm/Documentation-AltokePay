import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'quickstart',
    {
      type: 'category',
      label: 'Conceptos',
      collapsed: false,
      link: {type: 'doc', id: 'architecture/index'},
      items: ['architecture/security'],
    },
    {
      type: 'category',
      label: 'Client API',
      collapsed: false,
      link: {type: 'doc', id: 'api/index'},
      items: [
        'api/authentication',
        'api/scopes-environments',
        'api/payment-methods',
        'api/checkouts',
        'api/payment-links',
        'api/responses-errors',
      ],
    },
    {
      type: 'category',
      label: 'Integración',
      collapsed: false,
      link: {type: 'doc', id: 'integration/index'},
      items: [
        'integration/hosted-payment-links',
        'integration/webhooks',
        'integration/production-checklist',
      ],
    },
  ],
};

export default sidebars;
