---
id: overview
title: Overview
---

## What is Nuz?

:::important

Nuz is an experimental version that prepares for the 1.0.0 release. Suggestions and bug reports are welcome!

:::

Nuz is an [open-source](https://github.com/nuz-app/nuz) project, the runtime package manager to sharing packages such as components or libraries across the web application.

### Keys features

- 🧩 Compatible as dynamic [import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports) expressions, is [nuz.import()](getting-started#usage).
- ⚙️ Easy to [setup](getting-started#installation) and flexible to customize.
- 📦 Import and use any modules that don't need to install through [@nuz/core](../reference/core).
- ⏰ Not take time to rebuild time for the modules.
- 🚔 Safer by [integrity hash](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) check is the default.
- 🚨 Self-retry if it fails on download and auto fallback if initial fails.
- 🔥 Hot update the modules in the application without a rebuild.
- 📚 Write once, use in cross the applications.
- ⚡️ Easy to create, build, and publish quickly by [@nuz/cli](../reference/cli).
- 💼 Support fully-features to develop the module with [@nuz/cli](../reference/cli).
- ☁️ Provided [CDNs](../services/nuz-static) and [registry](../services/nuz-registry) public services on the cloud, it's free.
- ✨ Build and share great things with everyone through [the registry](../services/nuz-registry).
- 🎯 Fully support server-side with optimized options.

### Limitations

- ⚠️ Impossible to use modules on the [registry](../reference/registry) without a network connection.
- 🤔 Performance may be affected by network connection.

Recommended using Nuz services are [registry](../services/nuz-registry) and [static](../services/nuz-static) as CDNs to be optimized for Nuz ecosystem.

## Desire

Nuz hopes to change the way of developing modern web applications with great things.

### For developder

As a developer, build a lot of great things such as libraries, components and using them at many the applications. Releasing a patch or feature will take you a long time to update them in the app and rebuild it, then release the applications it to production, it may be but unnecessary operations. Nuz will help you eliminate those, you may not need to changes the code or do anything in your applications, just release a new module version, all applications will receive a affects immediately.

Building, sharing and contributing to the system of the modules on the [public registry](../services/nuz-registry) will make it easier to develop future web applications, improving reusability. Thinking of building a web application simply and importing the modules and connecting them in your application will take a lot of development time. In addition, maintenance is faster and easier when you can hot update modules without rebuilding, or you can choose a compatible version like `~1.0.0` it will automatically upgrade when `1.0.1` is available.

Nuz provides a free the [registry service](../services/nuz-registry) and [static service](../services/nuz-static) as CDNs for all public modules. These services are designed to ensure that it optimally works with the Nuz ecosystem, high performance, scableability and reliability.

More and more, contributing with us!

### For enterprise

If your enterprise is organizing personnel towards product teams or want to build a modern web application based on Micro Frontends architecture for front-end to scalability and compatibility with Microservices architecture at the back-end. Nuz will help your enterprise resolve the problems when implementing it, all tech teams will working together, sharing everythins such as libraries, components, and tools using in cross the applications quickly and efficiencies.

- Everything called modules, isolated and the teams can manage their own repositories according to their authority.
- The repository can contain appropriate module for unit testing, ci and cd, this helps keep the teams secure and helps the app's codebase be smaller, easier to manage and maintain.
- The teams don't need to take time to keeping up-to-date the shared modules and versioning of the modules by other teams.
- No time to rebuild the modules at the application to save time, costs and resources for the operation.
- The teams can develop standalone or workspaces and release a bugfix or feature independents with other teams by release a module version, it immediately affects that production.
- Unfortunately, there is a component of any team that has crashed, it will automatically fallback to the previous compatible version if after all the efforts are still not resolved, the applications still works but not include this module.
- High performance with lazy-loading for the application, only when modules are needed, can the modules be downloaded and used, which helps to reduce the first page load time and save bandwidth for unnecessary downloads.
- Easy to use, create and develop new modules by Nuz, meet high scalability but ensure reliability.
- Nuz is open-source, it is completely transparent and enterprise can self-hosted all the Nuz services.
