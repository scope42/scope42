// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'scope42 Documentation',
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
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/scope42/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'scope42 Documentation',
        logo: {
          alt: 'scope42 logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            href: 'https://app.scope42.org',
            label: 'scope42 App',
            position: 'left',
          },
          {
            href: 'https://github.com/scope42/scope42',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'Matrix',
                href: 'https://matrix.to/#/#scope42:matrix.org',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/get_scope42',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'scope42 App',
                href: 'https://app.scope42.org',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/scope42/scope42',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} scope42. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
