# 🔮 Nuz &middot; [![Travis Status](https://travis-ci.com/lamhieu-vk/nuz.svg?branch=develop)](https://travis-ci.com/lamhieu-vk/nuz) ![GitHub last commit](https://img.shields.io/github/last-commit/lamhieu-vk/nuz) ![GitHub issues](https://img.shields.io/github/issues/lamhieu-vk/nuz) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lamhieu-vk/nuz/blob/develop/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lamhieu-vk/nuz/blob/develop/CONTRIBUTING.md)

[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/nuz)

🔮 **Nuz** is a fancy library to implements Micro Frontends compatible with [ReactJS](https://reactjs.org) and may support more in the future 🏃.

***

## About

### Packages

| Name     | Description | Other |
|---------------|-----|-----|
| **[@nuz/core](https://github.com/lamhieu-vk/nuz/blob/develop/packages/nuz-core)**     | The core is define, resolve and manage  modules from the network in the application. | [![npm version](https://img.shields.io/npm/v/@nuz/core.svg?style=flat)](https://www.npmjs.com/package/@nuz/core) ![npm downloads](https://img.shields.io/npm/dm/@nuz/core) |
| **[@nuz/cli](https://github.com/lamhieu-vk/nuz/blob/develop/packages/nuz-cli)** | Cli is a tool to help create, develop, build, serve and publish a module in the simplest way. | [![npm version](https://img.shields.io/npm/v/@nuz/cli.svg?style=flat)](https://www.npmjs.com/package/@nuz/cli) ![npm downloads](https://img.shields.io/npm/dm/@nuz/cli) |
| **[@nuz/registry](https://github.com/lamhieu-vk/nuz/blob/develop/packages/nuz-registry)** | Provides functions to create a stable, secure and scalable registry server. | [![npm version](https://img.shields.io/npm/v/@nuz/registry.svg?style=flat)](https://www.npmjs.com/package/@nuz/registry) ![npm downloads](https://img.shields.io/npm/dm/@nuz/registry) |

And other packages just create to using in the main packages.

### How it work?

[View the workflow here](https://github.com/lamhieu-vk/nuz/tree/develop/docs#architectures-1) 🙈

### Quickstart

[Get started in 5 minutes](https://github.com/lamhieu-vk/nuz/blob/develop/docs/GET_STARTED.md) ⏱

### Examples

#### Master Apps
* **[create-next-app](https://github.com/lamhieu-vk/nuz/blob/develop/examples/apps/create-next-app)** - use Nuz with a typescript template created by create-next-app, both *server and client* side render, have [online example](https://create-next-app.nuz.now.sh) and deploy button.
* **[create-react-app](https://github.com/lamhieu-vk/nuz/blob/develop/examples/apps/create-react-app)** - use Nuz with a template created by create-react-app, *client-side* render only, have [online example](https://create-react-app.nuz.now.sh) and deploy button.

#### Modules
* **[hello-world](https://github.com/lamhieu-vk/nuz/blob/develop/examples/modules/hello-world)** - a module was created by [@nuz/cli](https://github.com/lamhieu-vk/nuz/blob/develop/packages/nuz-cli), have [online example](https://hello-world.nuz.now.sh) and deploy button.

#### Regitry Server
* **[simple-server](https://github.com/lamhieu-vk/nuz/blob/develop/examples/registry/simple-server)** - a registry server using [@nuz/registry](https://github.com/lamhieu-vk/nuz/blob/develop/packages/nuz-registry).

If you use Nuz for your project, PRs are welcome! 🎉

## Documentation

See more information about [documents here](https://github.com/lamhieu-vk/nuz/blob/develop/docs/README.md) 📚

## Micro Frontends

### What is Micro Frontends?

> The idea behind Micro Frontends is to think about a website or web app as **a composition of features** which are owned by **independent teams**. Each team has a **distinct area of business** or **mission** it cares about and specialises in. A team is **cross functional** and develops its features **end-to-end**, from database to user interface.

*from [micro-frontends.org](https://micro-frontends.org)*

> Micro-frontends is a microservice-like architecture that applies the concept of microservices to the browser side. Transforming to a mono-like applications from a single, single application to an application that combines multiple small front-end applications. Each frontend application can also be **standalone run**, **independent development**, **standalone deployment**.

*from [a post in dev.to](https://dev.to/phodal/micro-frontend-architecture-in-action-4n60)*

But you can think easier like... You can use Micro Frontends to building modern web apps with multiple teams, such as e-commerce, social network...

### How to implement Micro Frontends?

I found some articles about it

- [Micro-frontend Architecture in Action with six ways](https://dev.to/phodal/micro-frontend-architecture-in-action-4n60)
- [The Strengths and Benefits of Micro Frontends](https://www.toptal.com/front-end/micro-frontends-strengths-benefits)
- [Implementing a Frontend with Micro-Components](https://itnext.io/micro-frontend-941a5f1a3e72)
- [Understanding Micro Frontends](https://hackernoon.com/understanding-micro-frontends-b1c11585a297)

### Ah... sound like really hard to implement, right? 🤯 

> Yep, it really hard but... I created **Nuz** to help you! 😉

### But I already have a React app, do I have to rewrite it?

Nooo, you can use **Nuz** with your React application, **Nuz** is compatible with the projects created by [create-next-app](https://github.com/zeit/next.js) and [create-react-app](https://github.com/facebook/create-react-app).

## What Nuz can do?

**Nuz** just is something great to resolve the problems while implements Micro Frontends application such as:

- [x] 🛥 **Require modules from the network**
  - Compatible with Node require, just replace `require` by `resolve`.
  - Download resource from network, execute in safe context.
  - Support **timeout**, **retry** and **fallback** for modules while running.
  - Support **preload** and **preconnect** to reduce download time.
  - Secure with integrity hash downloaded content from CDN.
- [x] ⚡️ **Easy to create, dev, serve, build and publish modules**
  - Create a module **quickly**, just by a command.
  - Support development mode for **standalone** and **workspace** projects.
  - Build with **auto-optimize code** and **minify size**.
  - Easy to publish with **integrity hash check**.
  - File serving and directory listing in the module, allow secure methods.
  - Styling are supports **CSS modules**, **Less** and **Sass**, don't need config.
  - Using `svg` files as **React component** or static files.
  - Allow import **image files** and convert to `base64` or static files.
- [x] 📦 **Easy management the modules**
  - **High performance** to fetch config for many clients.
  - Permission **scope-based** using by token.
  - Support full APIs to management the permission and modules.
  - Allow **lock** module to prevent publish at dangerous time.
  - Allow **rollback** module by version.
  - Allow **auto create fallback** using previous for new publish.
  - Support secure methods with **https**, **http2**.
  - Support release by **schedule**.
  - Allow extends application by `express`.
- [x] 🖼 **Server-side rendering? Sure!**
  - Easy to enable **SSR** mode.
  - Compatible with [Next.JS](https://github.com/zeit/next.js), don't need modify on code.
- [x] 🧩 **Code-Splitting? Okkkk**
  - Default is **auto code-splitting** in build mode.
  - Support **dynamic imports**.
  - Splitting chunks with `webpack` config.


## Contributing

Please see our [CONTRIBUTING.md](https://github.com/lamhieu-vk/nuz/blob/develop/CONTRIBUTING.md) 📝

## Author

Hieu Lam ([@lamhieu-vk](https://github.com/lamhieu-vk)).
