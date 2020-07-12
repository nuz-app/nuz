---
id: motivation
title: Motivation
---

As the requirements to build the web modern application have become increasingly complicated, our components and modules more than ever before. It's must be reuse in the cross-application, faster updates, and reduce unnecessary steps to updates the new version in each of the applications.

Currently, in the world have many package manager for Javascript (or web) but all are build-time package manager. The build-time package manager will download all dependencies in the application to the local computer when calls install command and it's will resolve when your import code was called in source code. When released the application to production, must build the application includes all dependencies to a bundle, your bundle will be bigger by the business features increase. And because it's building time package manager if any dependencies in the application have been new updated version, the application must be rebuilt and redeployed, it takes much time if the company has many the applications and using many dependencies. In another, you also need increasing physical configuration to be able to build it. 

Nuz is different with the rest of the world. Nuz is the runtime package manager. Our application doesn't need to calls install command to download all dependencies to the local computer and it's only downloading, cache, and create the modules when your import code was called at runtime. So, the build time will not increase by the business features increase and when any dependencies have the new updated version, all applications don't need to rebuild or redeploy, it's will auto-update by config in the application.

Nuz hopes to change the way of developing modern web applications with great things:
- 📦 Write once and reuse it in any application.
- 🧩 Everything called a module and it's isolated to sharing, build a new application quickly by just to picks and use the shared modules.
- 🎯 Easy to maintain the application with many modules, update any modules just by a command.

View [desire here](getting-started#installation).
