module.exports = {
  sidebar: {
    Introduction: [
      'introduction/overview', 
      'introduction/motivation', 
      'introduction/concepts', 
      'introduction/getting-started', 
    ],
    Reference: [
      'reference/core',
      'reference/cli',
      'reference/registry',
      'reference/module',
      'reference/workspaces',
    ],
    Services: [
      'services/nuz-registry',
      'services/nuz-static',
    ],
    Guides: [
      'guides/create-new-module', 
      'guides/publish-a-module', 
    ],
    Support: [
      'faq',
      {
        type: 'link',
        label: 'Report an issue',
        href: 'https://github.com/nuz-app/nuz/issues/new',
      }
    ],
  },
};
