## Nuz
***

#### Should use it when?

**nuz** is created to resolve problems while implementing the micro-frontends project, the solution to build a large website such as e-commerce, social network, and more.
Techniques, strategies and recipes for building a **modern web app** with **multiple teams** that can **ship features independently**.

* **Independent** - creating independence for multiple teams to build and release features.
* **Management** - easy to manage the features, pages or widgets in the application by tags to off, release, rollback or a/b tests.
* **Scalability** - don't care about project size because it just a module and can be add a lot of modules.
* **Safely** - the risk of failure and isolating the fault area becomes easier and safer.

**tl;dr**: you can use **nuz** to *building modern web* app with *multiple teams*, such as: *e-commerce*, *social network*, and more.

#### How it works?

Read more at [here](https://github.com/lamhieu-vk/nuz/blob/master/docs/WORKFLOW.md)

#### Usage

To implement micro-frontends you need a **master app** and one or more **modules**. See **master app** as root application includes config and common dependencies such as `react` `react-dom` `redux`. See each **module** as a feature of a team, it's can build and release independent and using like a normal module in Javascript by `require` but using another way (function).

* **Master app** allow created by [create-react-app](#) or [create-next-app](#).
* **Module** allow created by [@nuz/cli](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-cli) or self-create by using [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack). Otherway, you can pull templates example for **module** as [here](https://github.com/lamhieu-vk/nuz/tree/master/templates).

You can see examples for micro-frontends projects at [here](https://github.com/lamhieu-vk/nuz/tree/master/examples).

### Ecosystems

* [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core) - core to define and resolve externals modules, implement as a worker for micro-frontends
* [@nuz/cli](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-cli) - cli to supports create, dev, build, serve and publish a module in nuz ecosystems
* [@nuz/registry](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-registry) - registry server support manage modules and related things
* [@nuz/utils](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-utils) - includes utils using in nuz packages
* [@nuz/shared](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-shared) - includes shared symbols and constants using in nuz packages

### Concepts

* **Master app / Master-module** - a root module, it is incluing modules define and install common dependencies. Inside [master app](#) of [master app](#) may contain one or more module.

* **Module / Inside-module** - a module using inside master module, it is not include modules define and using common dependencies from [master app](#). Inside [module](#) allow contain another [module](#) but prevent recursive calling.

* **Configuration / Config file** - a config file as name `nuz.config.js` in root folder of [module](#). Read more at [here](https://github.com/lamhieu-vk/nuz/blob/master/docs/CONFIGURATION.md).

* **Registry** - a registry same `npm` or `yarn` registry to *fetch*, *manage* and *publish* the modules in nuz ecosystem if you want to self-hosted. It's *not required* but I recommend for business.

### Author

Hieu Lam  ([@lamhieu-vk](https://github.com/lamhieu-vk)).
