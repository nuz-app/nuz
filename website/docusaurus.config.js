const GITHUB_ORG = 'nuz-app'
const GITHUB_PROJECT = 'nuz'
const GITHUB_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_PROJECT}`
const GITHUB_DEFAULT_BRANCH = 'next'

module.exports = {
  title: 'Nuz · Docs',
  tagline: 'Nuz is an open-source project, the runtime package manager for web platform.',
  url: 'https://docs.nuz.app',
  baseUrl: '/',
  favicon: 'images/favicon.ico',
  organizationName: 'nuz-app', // Usually your GitHub org/user name.
  projectName: 'nuz', // Usually your repo name.
  themeConfig: {
    // Thumbnail image,
    image: 'images/thumbnail.png',
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
        href: '/',
        target: '_self',
      },
      items: [
        {
          to: 'introduction/overview',
          activeBasePath: 'introduction',
          label: 'Introduction',
          position: 'right',
        },
        {
          to: 'reference/core',
          activeBasePath: 'reference',
          label: 'Reference',
          position: 'right',
        },
        { to: 'blog', label: 'Blog', position: 'right' },
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
          title: 'Quick links',
          items: [
            {
              label: 'Introduction',
              to: 'introduction/overview',
            },
            {
              label: 'Getting started',
              to: 'introduction/getting-started',
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
      copyright: `Copyright © ${new Date().getFullYear()} Nuz. Built with Docusaurus ❤️.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // Will be passed to @docusaurus/plugin-content-docs (false to disable)
        docs: {
          // Set base path of document pages
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            `${GITHUB_URL}/edit/${GITHUB_DEFAULT_BRANCH}/website/`,
          // Display update user, ex: Last updated by <Author Name>
          showLastUpdateAuthor: true,
          // Display update time, ex: Last updated on <date>
          showLastUpdateTime: true,
        },
        // Will be passed to @docusaurus/plugin-content-blog (false to disable)
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            `${GITHUB_URL}/edit/${GITHUB_DEFAULT_BRANCH}/website/blog/`,
        },
        // Will be passed to @docusaurus/theme-classic.
        theme: {
          customCss: require.resolve('./src/css/base.css'),
        },
        // Will be passed to @docusaurus/plugin-content-sitemap (false to disable)
        sitemap: {
          cacheTime: 600 * 1000, // 600 sec - cache purge period.
          changefreq: 'daily',
          priority: 0.5,
          trailingSlash: false,
        }
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@docusaurus/plugin-ideal-image'),
      {
        quality: 85,
        max: 1920, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 4, // the max number of images generated between min and max (inclusive)
      },
    ],
    [
      require.resolve('@docusaurus/plugin-pwa'),
      {
        offlineModeActivationStrategies: ['appInstalled', 'queryString'],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/images/favicon-96x96.png',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(103, 58, 183)',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          }
        ],
      }
    ],
  ],
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400&family=Nunito:wght@600&display=swap',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '57x57',
      href: '/images/apple-icon-57x57.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '60x60',
      href: '/images/apple-icon-60x60.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '72x72',
      href: '/images/apple-icon-72x72.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '76x76',
      href: '/images/apple-icon-76x76.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '114x114',
      href: '/images/apple-icon-114x114.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '120x120',
      href: '/images/apple-icon-120x120.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '144x144',
      href: '/images/apple-icon-144x144.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '152x152',
      href: '/images/apple-icon-152x152.png',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/images/apple-icon-180x180.png',
      type: 'image/png',
    },
    {
      rel: 'icon',
      sizes: '192x192',
      href: '/images/android-icon-192x192.png',
      type: 'image/png',
    },
    {
      rel: 'icon',
      sizes: '32x32',
      href: '/images/favicon-32x32.png',
      type: 'image/png',
    },
    {
      rel: 'icon',
      sizes: '96x96',
      href: '/images/favicon-96x96.png',
      type: 'image/png',
    },
    {
      rel: 'icon',
      sizes: '16x16',
      href: '/images/favicon-16x16.png',
      type: 'image/png',
    },
  ],
  onBrokenLinks: 'warn',
}
