# Nuz &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lamhieu-vk/nuz/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lamhieu-vk/nuz/blob/master/CONTRIBUTING.md)[![Travis Status](https://travis-ci.com/lamhieu-vk/nuz.svg?branch=master)](https://travis-ci.com/lamhieu-vk/nuz)

**Nuz** is a fancy library to implements Micro Frontends compatible with [ReactJS](#) and may support more in the future. 🏃

***

## About Micro Frontends

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
- [x] ⚡️ **Easy to create, develop, serve, build and deploy modules**
  - Create a module quickly, just by a command.
  - Support development mode for **standalone** and **workspace** projects.
  - Build with **auto-optimize code** and **minify size**.
  - Easy to publish with integrity hash check.
  - Support file serving and directory listing in module, allow secure methods.
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
  - Defalt is auto code-splitting in build mode.
  - Support **dynamic imports**.
  - Splitting chunks with `webpack` config.


## About

### Packages

- **[@nuz/core](https://github.com/lamhieu-vk/nuz/blob/master/packages/nuz-core)** - the core is define, resolve and manage  modules from the network in the application.
- **[@nuz/cli](https://github.com/lamhieu-vk/nuz/blob/master/packages/nuz-cli)** - Cli provides functions to create, dev, serve and deploy the modules with the best way.
- **[@nuz/registry](https://github.com/lamhieu-vk/nuz/blob/master/packages/nuz-registry)** - Provides functions to create a stable, secure and scalable registry server.

And other packages just create to using in the main packages.

### How it work?

[View the workflow here](https://github.com/lamhieu-vk/nuz/blob/master/docs/WORKFLOW.md) 🙈

### Quickstart

[Get started in 5 minutes](https://github.com/lamhieu-vk/nuz/blob/master/docs/GET_STARTED.md) ⏱

### Examples

* [nuz + create-next-app](https://github.com/lamhieu-vk/nuz/blob/master/examples/with-create-next-app) - using **nuz** with a typescript template created by create-next-app, both *server and client* side render.
* [nuz + create-react-app](https://github.com/lamhieu-vk/nuz/blob/master/examples/with-create-react-app) - using **nuz** with a template created by create-react-app, *client-side* render only.

If you using **nuz** for your project, PRs are welcome! 🎉

## Documentation

Update soon! ✍️

## Contributing

Please see our [CONTRIBUTING.md](https://github.com/lamhieu-vk/nuz/blob/master/docs/CONTRIBUTING.md) 📝

## Author

Hieu Lam ([@lamhieu-vk](https://github.com/lamhieu-vk)).
