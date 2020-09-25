# Documentation

## Micro Frontends

In general, I see that there are many articles about Micro Frontends, very good and detailed ones about the advantages and difficulties encountered when building a Micro Frontends project, I will list it below:
* [Micro Frontends - martinfowler.com](https://martinfowler.com/articles/micro-frontends.html).
* [Introduction to micro frontends architecture](https://levelup.gitconnected.com/brief-introduction-to-micro-frontends-architecture-ec928c587727).
* [Micro Frontends - micro-frontends.org](https://micro-frontends.org/).
* [Micro-frontend architecture in Action with six ways](https://dev.to/phodal/micro-frontend-architecture-in-action-4n60)
* [The Strengths and Benefits of Micro Frontends](https://www.toptal.com/front-end/micro-frontends-strengths-benefits)
* [Implementing a Frontend with Micro-Components](https://itnext.io/micro-frontend-941a5f1a3e72)
* [Understanding Micro Frontends](https://hackernoon.com/understanding-micro-frontends-b1c11585a297)

If you are starting to learn about Micro Frontends, you should read it to know why you should use Nuz. Nuz was created to solve some of the problems you have when starting out with Micro Frontends, there are many ways to solve those problems but I created it with the desire to make it easy to solve it. and become a common standard!

### Overview

*Note: when starting here, I will understand by default that you should consult and have some basic knowledge about Micro Frontends.*

The Micro Frontends architecture was inspired by Micro Services and was born to replace the monolithic architecture that has been around for a long time. With Micro Frontends, each feature component on the interface as a service in Micro Services, you can split it or keep it at a level such as: by component, by feature, by feature group, by page,... But the best way, keep it at the component level and a group can manage multiple components, to know why you please follow along.

#### Architectures

See, this is the difference between traditional architecture and using Micro Frontends.

##### Traditional
![image](https://user-images.githubusercontent.com/9839768/77920413-a6760700-72c8-11ea-927a-b2f520e967b8.png)

##### Micro Frontends
Same advantages as for microservices, but with end-to-end teams if combined by microservices on back-end.
![image](https://user-images.githubusercontent.com/9839768/77920665-f81e9180-72c8-11ea-8bf9-841e289c7ab8.png)

*You can read more about this from [here](https://levelup.gitconnected.com/brief-introduction-to-micro-frontends-architecture-ec928c587727).*


#### Benefits

Its benefits are numerous, but I will highlight some key points below:

##### Simple, decoupled codebases
The source code for each individual micro frontend will by definition be much smaller than the source code of a single monolithic frontend. These smaller codebases tend to be simpler and easier for developers to work with

##### Independent deployment
Just as with microservices, independent deployability of Micro Frontends is key. This reduces the scope of any given deployment, which in turn reduces the associated risk. Regardless of how or where your frontend code is hosted, each micro frontend should have its own continuous delivery pipeline, which builds, tests and deploys it all the way to production. 

![image](https://user-images.githubusercontent.com/9839768/77922141-daeac280-72ca-11ea-80e5-9afd5d540c5a.png)

*A part of the content from this article, it's very good and you can see the [details here](https://martinfowler.com/articles/micro-frontends.html#Benefits).*

##### Autonomous teams
As a higher-order benefit of decoupling both our codebases and our release cycles, we get a long way towards having fully independent teams, who can own a section of a product from ideation through to production and beyond. Teams can have full ownership of everything they need to deliver value to customers, which enables them to move quickly and effectively.

![image](https://user-images.githubusercontent.com/9839768/77922074-c27aa800-72ca-11ea-9b79-3e9a272ab9ce.png)

##### In a nutshell
In short, Micro Frontends are all about slicing up big and scary things into smaller, more manageable pieces, and then being explicit about the dependencies between them. Our technology choices, our codebases, our teams, and our release processes should all be able to operate and evolve independently of each other, without excessive coordination.

#### When to use Micro Frontends

* Huge code base where different teams are contributing to
* Code ownership get messy
* Deployment is delayed because of other part of the application
* You like to use different FE frameworks

#### What the problems?

* Modules management
* Routing
* Sharing global state and communicate between apps
* Shared component libraries
* Styles collision
* SEO and UX
* Testing

Don't give up yet, you've got Nuz 😂.

## About Nuz

Find out how Nuz solves problems for you, maybe you can help us improve it!

### Desire

We want to create a solution that makes Micro Frontends implementation easier. Also, if we want to make it compatible with running projects, we have to rebuild a new project if possible. I want to develop the components of Micro Frontends as simple as it is now and don't care much about how it works background. Finally, ensure the requirements of an Micro Frontends project.

### Architectures

See the map below

![image](https://user-images.githubusercontent.com/9839768/77934078-c7932380-72d9-11ea-8b92-6b191801d1af.png)

*Note: Nuz is [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core).*

#### Concepts

##### Master app
This is the main application, it is the place to store dependencies, shared libraries, routing processing and core components of the project used in modules. It should be an empty page, processing and calling other modules to render, treat it like a nginx server for configuration and navigation, but it will run in the browser!

*Note: recommended to create by [create-react-app](https://create-react-app.dev) or [create-next-app](https://github.com/zeit/next.js).*

##### Modules
It is a component, or more than that. Define it as an NPM module installed into the project. It exports an element to render on the application, or may contain additional things like tools or more, up to you.

*Note: use [@nuz/cli](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-cli) to create new modules.*

##### Shared libraries
Libraries are shared among modules, it will be lazy loaded when one of the used modules is initialized!

##### Store management
Is the general store of the whole project, can be `redux` store or any. It should only be stored collectively if a value is used more often, limiting data sharing (because we expect each to be independent, including the api from the backend).

##### Registry server
Registry server is a place to store information about modules (resources, integrity hash, shared, ...), [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core) will call this server to get information and resolve modules. Use [@nuz/registry](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-registry) to create it!

##### CDN Resources
The content distribution network contains the resources of the modules, which are built by [@nuz/cli](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-cli) and synchronized.


### Workflow

* When the user enters your application, [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core) will call up the registry server to get information about the configuration of the modules used in the application.
* Once the modules have been configured, it will automatically create preload or preconnect to the origin used in the received configuration.
* And at the same time React will render your application, if any, it renders to any of the modules identified. Determined to resolve by [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core), [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core) will download resources and create a secure execution environment, after execution will return the module like a normal module!
* In case the module is called using a shared library, if the library is already in, it will be used, if not already downloaded it will be downloaded before the module's resources are downloaded and executed, you do not need to Having to care about syncing it, [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core) has done it for you!

**Some notes to know:**
* During the configuration process from the registry server, React render will be blocked until it receives configuration. To solve this problem, Nuz supports several cache mechanisms to minimize waiting time.
* The CDN connection will determine part of the download speed of the resource!
* Modules are downloaded at runtime, not bundled in Master app!

### Packages

* **[@nuz/core](https://github.com/nuz-app/nuz/blob/develop/packages/nuz-core)** - the core is define, resolve and manage  modules from the network in the application.
* **[@nuz/cli](https://github.com/nuz-app/nuz/blob/develop/packages/nuz-cli)** - Cli provides functions to create, dev, serve and deploy the modules with the best way.
* **[@nuz/registry](https://github.com/nuz-app/nuz/blob/develop/packages/nuz-registry)** - Provides functions to create a stable, secure and scalable registry server.

### Reslved

#### Modules management
We have created [@nuz/registry](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-registry) to create a registry server for you to manage modules, publish, rollback, support token authorization. [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core) will call the registry server to determine which modules version is being used!

#### Routing
The master app will be the routing container. If you create a master using [create-next-app](https://github.com/zeit/next.js), routing is followed the instructions of [next.js](https://nextjs.org). If you create the master app with [create-react-app](https://create-react-app.dev/), you can refer to using [react-router](https://create-react-app.dev/docs/adding-a-router) for this job.

#### Sharing global state and communicate
You can easily use [redux](https://redux.js.org) in a project.

#### Shared component libraries
[@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core) has already handled this, and you will only lazy load the library used by the module when the module is initialized!

#### Styles collision
[@nuz/cli](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-cli) takes care of this for you, you just need to select the library you want to use when creating the module using [@nuz/cli](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-cli), everything else is solved!

#### SEO and UX
If you are interested in SEO and Server-side-rendering, you can use [Next.js](https://nextjs.org) for the master app, Nuz is compatible with [Next.js](https://nextjs.org).

#### Testing
Since modules are a component, you can easily test it with [jest](https://jestjs.io) and [enzyme](https://github.com/enzymejs/enzyme).

## Advanced

Update soon! 🖋
