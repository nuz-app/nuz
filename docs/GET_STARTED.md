# Getting started

For using Nuz to implements Micro Frontends for your project, you must have an application using React, of course.
If you want to start a new project, you can use [creact-react-app](#) or [creact-next-app](#) to create the master app.

## 🎮 Config in-app

For the first time using Nuz, you must configure Nuz in the master app. It is easy to game, you can follow a step-by-step below. And if your master app created by [create-react-app](#) reference [here]((https://github.com/lamhieu-vk/nuz/tree/master/examples/with-creact-react-app)), [create-next-app](#) is [here](https://github.com/lamhieu-vk/nuz/tree/master/examples/with-create-next-app).


### Installation 

You much install [@nuz/core](#) to handles the main workflow and [@nuz/cli](#) to working with modules and start development mode in the workspace for the master app.

To install [@nuz/core](#) package, you just run below command:
```sh
# with npm
$ npm install @nuz/core

# or yarn
$ yarn add @nuz/core
```
*Note: [@nuz/core](#) must be installed as `dependencies`.*

And install [@nuz/cli](#) package with:
```sh
# with npm
$ npm install --dev @nuz/cli

# or yarn
$ yarn add -D @nuz/cli
```
*Note: [@nuz/cli](#) is allow installed as `devDependencies`.*

Run below command to check version of [@nuz/cli](#):
```sh
$ nuz --version
```

### Bootstrap in-app

For [@nuz/core](#) work in your app, you must be run `bootstrap` in app.
Should be run `bootstrap` in the top of app flow, by below code:
```ts
import React from 'react';
import ReactDOM from 'react-react';
import { bootstrap } from '@nuz/core';

bootstrap({
  // BootstrapConfig
})
```

Example:
```ts
import React from 'react';
import ReactDOM from 'react-react';

bootstrap({
  // Uncomment if using `workspace` mode of `@nuz/cli`
  // linked: {
  //   port: 4000,
  // },
  vendors: {
    react: React,
    'react-dom': ReactDOM,
  },
})
```
*Note: `port` in above example is port expose of `workspace` mode of [@nuz/cli](#).*

If you using fully Nuz in your project, you just create an above config that is done! 🥳

In the below is the advanced config, you can read to reference.

#### Bootstrap config

```ts
export interface BootstrapConfig {
  /**
   * Set development mode
   */
  dev?: boolean
  /**
   * Allow server-side-rendering
   */
  ssr?: boolean
  /**
   * Defined vendors dependencies
   */
  vendors?: VendorsConfig
  /**
   * Defined shared dependencies
   */
  shared?: SharedConfig
  /**
   * Preload modules
   */
  preload?: string[]
  /**
   * Config registry to resolve
   */
  registry?: string | RegistryConfig
  /**
   * Linked info, use for workspace
   */
  linked?: LinkedConfig
  /**
   * Defined modules to resolve in runtime
   */
  modules?: ModulesConfig
}
```

##### `dev?: boolean`
Default is: `process.env.NODE_ENV !== 'production'`

Use this value to identify `development` and `production` mode. 

##### `ssr?: boolean`
Default is `false`

Allow [@nuz/core](#) resolve modules in Node environment. Set `true` if using [create-next-app](#) or using server-side-rendering. 

##### `vendors?: VendorsConfig`
Default is `{}`.

Vendors dependencies should be included in common library using in all the modules and master app such as `react`, `react-dom`, `redux` and more.`react` and `react-dom` is **required**.

Example:
```ts
import React from 'react';
import ReactDOM from 'react-dom';

{
  ...
  vendors: {
    react: React,
    'react-dom': ReactDOM,
    ...
  },
}
```
*Note: the modules using [@nuz/cli](#), install vendors dependencies as `peerDependencies` of module. `react` `react-dom` `@nuz/core` is required in modules*

##### `shared?: SharedConfig`
Default is `{}`

Shared dependencies are the same vendors dependencies but it requires is a *dynamic import function*. Shared dependencies only call to load *while modules using it resolving*.

Example:
```ts
{
  ...
  shared: {
    lodash: () => import('lodash'),
    'memoize-one': () => import('memoize-one'),
  },
}
```
*Note: the modules using [@nuz/cli](#) must be add shared dependencies to `shared` field in [config file](#) and like normal dependencies.*

##### `preload?: string[]`
Default is `[]`

Set preload modules, it will be downloaded and processed first. Should be set first load modules in app.

Example:
```ts
{
  ...
  preload: ['navigation', 'left-menu'],
}
```

##### `registry?: string | RegistryConfig`
Default is `undefined`

It provides [registry server](#) url, [@nuz/core](#) will call fetch to this url get config from upstream. It should be a `string` url.

Example:
```ts
// REGISTRY_URL=https://example-registry-server.com

{
  ...
  registry: process.env.REGISTRY_URL,
}
```

##### `linked?: LinkedConfig`
Default is `undefined`

It only work when set `dev: true`, it provides info of local linked modules such as `port` of socket. `port` is same port in [command run workspace](#).

Example:
```sh
$ nuz workspace --port 4000
```

```ts
// LINKED_PORT=4000

{
  ...
  linked: {
    port: process.env.LINKED_PORT,
  },
}
```

##### `modules?: ModulesConfig`

The values of `modules` can merge with modules config in upstream response from the [registry server](#). If you using [@nuz/registry](#) and [@nuz/cli](#), you don't need to define it.

Example:
```ts
{
  ...
  modules: {
    'module-name': BaseItemConfig,
  },
}

type BaseItemConfig = {
  /**
   * Upstream is resolve info of module
   */
  upstream?: UpstreamConfigAllowed
  /**
   * Fallback resolve for module, define like `upstream`
   */
  fallback?: UpstreamConfigAllowed
  /**
   * Override local modules
   */
  local?: LoadedModule<any>
  /**
   * Library name, bundle with `umd` format
   */
  library?: string
  /**
   * Format of library. Currently, default is `umd` format
   */
  format?: ModuleFormats
  /**
   * Alias name for fields in module
   */
  alias?: { [field: string]: any }
  /**
   * Export only, not use will exports fields
   */
  exportsOnly?: string[]
  /**
   * Install options
   */
  options?: InstallConfig
  /**
   * Shared dependencies module used
   */
  shared?: string[]
}
```

### Factory helpers for React

To make sure React only render after modules is prepared you must be use `reactHelpersFactory` to do it. Should be add `reactHelpersFactory` to above of `bootstrap`, by below code:

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import { reactHelpersFactory } from '@nuz/core';

// Using App component to wrap root component in-app.
const { App } = reactHelpersFactory({
  React,
  ReactDOM,
})

// Just a example to using App
ReactDOM.render((
  <App>
    <YourAppComponent />
  </App>
), document.getElementById('root'))
```

### Usage

[@nuz/core](#) is compatible with es dynamic import, you can see example:

Current way to use dynamic import by:
```ts
const something = import('path-to-resolve');
```

Using [@nuz/core](#) to resolve from network:
```ts
import { resolve } from '@nuz/core';

const something = resolve('module-name');
```

#### Use `React.lazy`

Currently, lazy load a component:
```ts
import React from 'react';

const AnyComponent = lazy(() => import('path-to-resolve'));
```

And with [@nuz/core](#):
```ts
import React from 'react';
import { resolve } from '@nuz/core';

const AnyComponent = lazy(() => resolve('module-name'));
```

#### Use `next/dynamic`

With [Next.js](#), to lazy load component you can use:
```ts
import dynamic from 'next/dynamic';

const AnyComponent = dynamic(() => import('path-to-resolve'));
```

And with [@nuz/core](#):
```ts
import dynamic from 'next/dynamic';
import { resolve } from '@nuz/core';

const AnyComponent = dynamic(() => resolve('module-name'), { nuz: true });
```
*Note: to using [@nuz/core](#) with [next.js](#), you must config something in `next.config.js`, read more at [here](#).*

## 🎲 Usage modules

### Create a new

Go to the folder you want to create module inside, use [@nuz/cli](#) to create new module by command:
```sh
$ nuz create
```
After answer the questions, your new module will auto-generated.
More information about scripts inside new module will display in your terminal window. You can read more at [here](#).

#### Link modules

You can use [workspace command](#) to links modules in development mode.

To quick use, in the root of the master app, add the script to package.json:
```ts
{
  ... 
  scripts: {
    ...
    "dev-workspace": "nuz workspace --workspace './workspace/*' --port 4000"
  }
}
```

About parameter in script:

##### `workspace: string[]`
Workspace value is array paths of modules want to links

##### `port: number` 
Port value is expose port of links socket, using as `linked` field in bootstrap config.

### Good luck! 👍

If you think you can update the document to make it clearer, PRs are welcome!
