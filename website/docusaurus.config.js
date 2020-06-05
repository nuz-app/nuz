const GITHUB_ORG = 'nuz-app';
const GITHUB_PROJECT = 'nuz';
const GITHUB_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_PROJECT}`
const GITHUB_BRANCH = 'next';

module.exports = {
  title: 'Nuz',
  tagline: 'Nuz is an ecosystem to manage runtime packages for web platform',
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
      links: [
        {
          to: 'docs/overview',
          activeBasePath: 'docs',
          label: 'Documents',
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
      logo: {
        alt: 'Nuz Project',
        src: '/images/logo-320x320.png',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Nuz. Built with Docusaurus ❤️.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            `${GITHUB_URL}/edit/${GITHUB_BRANCH}/website/`,
          // Display update user, ex: Last updated by <Author Name>
          showLastUpdateAuthor: true,
          // Display update time, ex: Last updated on <date>
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            `${GITHUB_URL}/edit/${GITHUB_BRANCH}/website/blog/`,
        },
        theme: {
          customCss: require.resolve('./src/css/base.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@docusaurus/plugin-sitemap'),
      {
        cacheTime: 600 * 1000,
        changefreq: 'daily',
        priority: 0.5,
      },
    ],
    // [
    //   require.resolve('@docusaurus/plugin-ideal-image'),
    //   {
    //     quality: 85,
    //     max: 1030, // max resized image's size.
    //     min: 640, // min resized image's size. if original is lower, use that size.
    //     steps: 2, // the max number of images generated between min and max (inclusive)
    //   },
    // ],
  ],
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400&family=Nunito:wght@600&display=swap',
      rel: 'stylesheet',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '57x57',
      href: '/images/apple-icon-57x57.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '60x60',
      href: '/images/apple-icon-60x60.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '72x72',
      href: '/images/apple-icon-72x72.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '76x76',
      href: '/images/apple-icon-76x76.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '114x114',
      href: '/images/apple-icon-114x114.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '120x120',
      href: '/images/apple-icon-120x120.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '144x144',
      href: '/images/apple-icon-144x144.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '152x152',
      href: '/images/apple-icon-152x152.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/images/apple-icon-180x180.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      href: '/images/android-icon-192x192.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/images/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: '/images/favicon-96x96.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/images/favicon-16x16.png',
    },
    {
      rel: 'manifest',
      href: '/images/manifest.json',
    }
  ],
};
