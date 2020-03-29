# Getting started

For using Nuz to implements Micro Frontends for your project, you must have an application using React, of course.
If you want to start a new project, you can use [creact-react-app](#) or [creact-next-app](#) to create the master app.

## 🎮 Config in-app

For the first time using Nuz, you must configure Nuz in the master app. It is easy to game, you can follow a step-by-step below. And if your master app created by [create-react-app](#) reference [here]((https://github.com/lamhieu-vk/nuz/tree/develop/examples/with-creact-react-app)), [create-next-app](#) is [here](https://github.com/lamhieu-vk/nuz/tree/develop/examples/with-create-next-app).


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

### Bootstrap

For [@nuz/core](#) work in your app, you must be run `bootstrap`, inject to renderers of `react-dom` in app.

Should be run `bootstrap` in the top of app flow, by below code:
```ts
import React from 'react';
import ReactDOM from 'react-react';

import { 
  bootstrap,
  reactHelpersFactory,
} from '@nuz/core';

// inject to renderers of `react-dom`
const { App } = reactHelpersFactory({
  React,
  ReactDOM,
})

// run bootstrap
bootstrap(
  // BootstrapConfig
)
```

If you master app was created by [create-react-app](#) or [create-next-app](#) you can see example for bootstrap below!

#### Integrate for `create-react-app`

Change `src/index.js` file from:
```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

```

To:
```js
import { bootstrap, reactHelpersFactory } from '@nuz/core';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const { App: AppProvider } = reactHelpersFactory({
  React,
  ReactDOM,
})

bootstrap({
  // ... BootstrapConfig
  linked: {
    port: 4000,
  },
  vendors: {
    react: React,
    'react-dom': ReactDOM,
  },
});

ReactDOM.render((
  <AppProvider>
    <App />
  </AppProvider>
), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

It was done! Currently, you can use **Nuz** in your project. Start with [create new module](#) below!

Try to create new module and usage like example:
```js
import React from 'react';

const ModuleComponent = lazy(() => import('module-name'));
```

#### Integrate for `create-next-app`

Create `next.config.js` file with content:
```js
const nuz = require('@nuz/core')

const { withNuz } = nuz.nextHelpersFactory({
  require,
})

module.exports = withNuz();
```

Create `pages/_app.jsx` file with content:
```js
import React from 'react'
import ReactDOM from 'react-dom'
import Head from 'next/head'

import { bootstrap, reactHelpersFactory } from '@nuz/core'

const { App } = reactHelpersFactory({
  React, 
  ReactDOM,
})

bootstrap({
  ssr: true,
  linked: {
    port: 4000,
  },
  vendors: {
    'react': React,
    'react-dom': ReactDOM,
  },
})

function MyApp({ Component, pageProps }: any) {
  return (
    <App injectHead={Head}>
      <Component {...pageProps} />
    </App>
  )
}

export default MyApp
```

It was done! Currently, you can use **Nuz** in your project. Start with [create new module](#) below!

Try to create new module and usage like example:
```js
import dynamic from 'next/dynamic';
import { resolve } from '@nuz/core';

const ModuleComponent = dynamic(() => resolve('module-name'), { nuz: true });
```

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

## Good luck! 👍

If you think you can update the document to make it clearer, PRs are welcome!
