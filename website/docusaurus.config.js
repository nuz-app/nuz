const GITHUB_ORG = 'nuz-app';
const GITHUB_PROJECT = 'nuz';
const GITHUB_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_PROJECT}`

module.exports = {
  title: 'Nuz',
  tagline: 'Nuz is an ecosystem to manage runtime packages for web platform',
  url: 'https://docs.nuz.app',
  baseUrl: '/',
  favicon: 'images/favicon.ico',
  organizationName: 'nuz-app', // Usually your GitHub org/user name.
  projectName: 'nuz', // Usually your repo name.
  themeConfig: {
    // Always expanded sidebar
    sidebarCollapsible: false,
    gtag: {
      trackingID: process.env.GA_DOCUMENT_ID,
    },
    algolia: {
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME,
    },
    navbar: {
      title: 'Nuz',
      logo: {
        alt: 'Nuz Logo',
        src: 'images/logo.png',
      },
      links: [
        {
          to: 'docs/doc1',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: GITHUB_URL,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/overview',
            },
            {
              label: 'Getting started',
              to: 'docs/getting-started',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/nuz',
            },
            {
              label: 'Spectrum Chat',
              href: 'https://spectrum.chat/nuz',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: GITHUB_URL,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nuz Project, Inc. Built with Docusaurus ❤️.`,
    },
  },
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400&family=Nunito:wght@600&display=swap',
      rel: 'stylesheet',
    },
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            `${GITHUB_URL}/edit/next/website/`,
          // Display update user, ex: Last updated by <Author Name>
          showLastUpdateAuthor: false,
          // Display update time, ex: Last updated on <date>
          showLastUpdateTime: false,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            `${GITHUB_URL}/edit/next/website/blog/`,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  // plugins: [
  //   [
  //     '@docusaurus/plugin-ideal-image',
  //     {
  //       quality: 85,
  //       max: 1030, // max resized image's size.
  //       min: 640, // min resized image's size. if original is lower, use that size.
  //       steps: 2, // the max number of images generated between min and max (inclusive)
  //     },
  //   ],
  // ],
};
