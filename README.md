# 🔮 Nuz &middot; [![Status](https://github.com/lamhieu-vk/nuz/workflows/nuz/badge.svg)](https://github.com/lamhieu-vk/nuz/actions) ![GitHub last commit](https://img.shields.io/github/last-commit/lamhieu-vk/nuz) ![GitHub issues](https://img.shields.io/github/issues/lamhieu-vk/nuz) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lamhieu-vk/nuz/blob/develop/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lamhieu-vk/nuz/blob/develop/CONTRIBUTING.md)

[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/nuz)

> 📌 This branch to prepare for the 1.0.0 version!

🔮 **Nuz** is an ecosystem to manage runtime packages for web platform.

Nuz is like a [Node.js require](https://nodejs.org/en/knowledge/getting-started/what-is-require/) but the modules will be resolved from the network at runtime instead of bundle in the main source. This changes the way the web platform is developed, everything is almost shared and updated consistently and constantly, it also solves the problem when implement Micro Frontends.

### Take an easy to understand example

When you use a require like below:
```js
require('module-awesome')
```

Traditionally, the resolver will look for this module in the `node_modules` directory (or where you have configured paths) to find **module-awesome** and use it. **module-awesome** will be bundled into your code when deploy to production, and when you need to change or upgrade you will have to bundle it all up.

Use with Nuz, **module-awesome** will be resolved from the network and use it. You will not need to bundle **module-awesome** into your code when deploy to production. When you need to update, you also do not need to bundle used places!

### Practical use case example

For example, if you have a homepage like Facebook's, your business develops products under "product teams" and you have multiple teams together, you don't want teams dependent on each other and you want everything to read, from APIs to Frontends.

Take a look at the picture below (source from internet, I have added note).

![Facebook Newsfeed example](https://user-images.githubusercontent.com/9839768/80710807-8c268780-8b19-11ea-8f3f-747153a92a65.jpg)

We have teams that follow the scope comment:
  - **@fb-products**: Manage other features.
  - **@fb-ads**: Manage ads.
  - **@fb-messages**: Manage messages of users.
  - **@fb-feeds**: Manage information about newfeed users.
  - **@fb-design-system** (pink): Design system team.

#### Problems that may be encountered are
  - The source code is too big, very hard to manage:
    - Can a member view the frontends source code of all??
    - Source code management: branching, creating PR, and release.
    - Is the source code too large to require a longer build time? Both develop mode and production mode.
  - Decentralization of teams.
  - Debug issues, develop and release new features.

#### When using Nuz, you can solve that problem by
  - Split modules like Microservices for Frontends (called MicroFrontends) by teams:
    - A repository (or module) only contains a component or a feature.
    - You easily assign repository access to members of teams.
    - By splitting the module, you can easily manage, develop features, and release it.
  - When a problem occurs, only that module is down. Other modules still work well.
  - No need to bundle source code agian. When a module like the component button of @fb-design-system is updated, users do not need to rebuild it as it is runtime modules.

***

## About

### Packages

| Name     | Description | Other |
|---------------|-----|-----|
| **[@nuz/core](https://github.com/lamhieu-vk/nuz/blob/develop/packages/nuz-core)**     | Core to manage and handles resolve runtime packages in the application. | [![npm version](https://img.shields.io/npm/v/@nuz/core.svg?style=flat)](https://www.npmjs.com/package/@nuz/core) ![npm downloads](https://img.shields.io/npm/dm/@nuz/core) |
| **[@nuz/cli](https://github.com/lamhieu-vk/nuz/blob/develop/packages/nuz-cli)** | The command-line interfaces to manage modules and interact with the registry server. | [![npm version](https://img.shields.io/npm/v/@nuz/cli.svg?style=flat)](https://www.npmjs.com/package/@nuz/cli) ![npm downloads](https://img.shields.io/npm/dm/@nuz/cli) |
| **[@nuz/registry](https://github.com/lamhieu-vk/nuz/blob/develop/packages/nuz-registry)** | A factory to create the registry server for the Nuz ecosystem. | [![npm version](https://img.shields.io/npm/v/@nuz/registry.svg?style=flat)](https://www.npmjs.com/package/@nuz/registry) ![npm downloads](https://img.shields.io/npm/dm/@nuz/registry) |

And other packages just create to using in the main packages.

### How it work?

[View the workflow here](https://github.com/lamhieu-vk/nuz/tree/develop/docs#architectures-1) 🙈

### Quickstart

[Get started in 5 minutes](https://github.com/lamhieu-vk/nuz/blob/develop/docs/GET_STARTED.md) ⏱


## Documentation

See more information about [documents here](https://github.com/lamhieu-vk/nuz/blob/develop/docs/README.md) 📚

## Contributing

Please see our [CONTRIBUTING.md](https://github.com/lamhieu-vk/nuz/blob/develop/CONTRIBUTING.md) 📝

## Author

Hieu Lam ([@lamhieu-vk](https://github.com/lamhieu-vk)).
