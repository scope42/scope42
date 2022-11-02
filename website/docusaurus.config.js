// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'scope42',
  tagline: 'Improve your software architecture with precision!',
  url: 'https://docs.scope42.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'scope42', // Usually your GitHub org/user name.
  projectName: 'scope42', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/scope42/scope42/tree/main/website'
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: require.resolve('./sidebars.js')
      }
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../packages/scope42-data/src/index.ts'],
        tsconfig: '../packages/scope42-data/tsconfig.json',

        out: '../api/data',
        sidebar: {
          categoryLabel: '@scope42/data',
          position: 2
        }
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'scope42',
        logo: {
          alt: 'scope42 logo',
          src: 'img/logo.svg'
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            docId: 'introduction',
            label: 'Docs'
          },
          {
            to: '/api/',
            label: 'API',
            position: 'left',
            activeBaseRegex: `/api/`
          },
          {
            href: 'https://github.com/scope42/scope42',
            label: 'GitHub',
            position: 'right'
          },
          {
            href: 'https://app.scope42.org',
            label: 'App',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/get_scope42'
              },
              {
                label: 'Mastodon',
                href: 'https://floss.social/@scope42'
              },
              {
                label: 'Matrix',
                href: 'https://matrix.to/#/#scope42:matrix.org'
              },
              {
                label: 'Forum',
                href: 'https://github.com/scope42/scope42/discussions'
              }
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'App',
                href: 'https://app.scope42.org'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/scope42/scope42'
              }
            ]
          }
        ],
        copyright: `Copyright © 2021-${new Date().getFullYear()} scope42. Built with Docusaurus.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
}

module.exports = config
