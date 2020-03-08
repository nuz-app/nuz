## @nuz/cli
***

**@nuz/cli** is a cli to supports [create](#create), [dev](#dev), [build](#build), [serve](#serve) and [publish](#publish) a module using nuz ecosystems.

* **Create** create a module by a templates or auto generate new templates based on requirements.
* **Dev** run development mode for mode.
* **Build** bundle and optimization module.
* **Serve** serve static resource in moudle, the same [serve](https://github.com/zeit/serve) but based on nuz config.
* **Publish** if you using [@nuz/registry](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-registry) to host and manament the modules, this command will help you publish to your registry.

* ****

### Installation

Easy to install **@nuz/cli**, you can use `yarn` or `npm`.

```bash
# install by yarn
$ yarn add @nuz/cli

# install by npm
$ npm install @nuz/cli
```

Check **@nuz/cli** was installed

```bash
# list all commands
$ nuz --help

# check current version
$ nuz --version
```

### Concepts

* **nuz module** is a module using **@nuz/cli** to work, having `nuz.config.js` file to config module.
* **nuz config** is a config file as name `nuz.config.js` in root folder of module. Read more at [here](#file-config).

### Documentation

#### File config

In root folder of module having a file with name is `nuz.config.js`, this is a config file. **@nuz/cli** will read this file to get defined values.

```js
module.exports = ({
  // Define module name
  // Use `name` field in `package.json` if not defined
  name: 'module-name',
  // Define library name of module
  // Use `library` field in `package.json` if not defined
  library: 'ModuleName',
  // Define source file of module
  // Use `source` field in `package.json` if not defined
  input: 'src/index.jsx',
  // Define output file of module
  // Use `main` field in `package.json` if not defined
  output: 'dist/index.js',

  // Set feature to enable auto loaders for module
  // Set feature is `true` will auto detect all loaders (recommend, default). `false` if want to turn off all.
  feature?: true,
  // Another ways to use
  feature?: {
    // Turn of loader
    typescript: false,
    // Turn on loader
    react: true,
    // If pass object, we will provide it to loader of webpack.
    css: {},
    less: {},
    sass: {},
    postcss: {},
  },
  
  // Extends externals config of webpack, default will set externals for `react`, `react-dom` and `@nuz/core`.
  externals?: {},

  // Set `publicPath` config of webpack, it is important if you using @nuz/registry.
  // Should be define it, remember '/' as end.
  publicPath: 'https://another-cdn.com/',

  // If you using @nuz/registry, you need config it
  publishConfig?: {
    // Permission token to publish a module
    token: 'abcxyz',
    // Endpoint of registry server
    endpoint: 'https://registry-endpoint.com',
  },
})
```

#### Bundle

* **Webpack** is bundler using in **@nuz/cli** to bundle code.

#### Create

```bash
$ nuz create

Create a module for micro frontends project

Options:
  --name, -n      Module name
  --template, -t  Module template
```

**create** command to create a module based a template provided or answers questions to gerenate new template based on your requirements.

##### Examples

Create a module based on requirements.

```bash
$ nuz create
```

Create a module with name is `product-detail` based on template [basic-module-webpack](https://github.com/lamhieu-vk/nuz/tree/master/templates/basic-module-webpack).

```bash
$ nuz create --name product-detail --template basic-module-webpack
```

With this script, **@nuz/cli** will check template by name on Github and download to your computer and init module. View list templates in [here](https://github.com/lamhieu-vk/nuz/tree/master/templates).
*Note: module from template maybe not a nuz module.*

### Dev

```bash
$ nuz dev

Run development mode

Options:
  --port, -p  Port to bind on                                           [number]
```

**dev** command to start development mode for module. It only work for nuz module was genarated by nuz create command.

### Build

```bash
$ nuz build

Run production mode to bundle module

Options:
  --clean, -c  Clean dist folder before run build       [number] [default: true]
```

**build** command to bundle module into `output` file. In production mode, code of module is optimized to using with [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core).

### Serve

```bash
$ nuz serve

Serve static resource in module

Options:
  --port, -p  Port to bind on                                           [number]
```

**serve** command will serve resource in `output` dir of module.

### Publish

```bash
nuz publish

Publish version for module

Options:
  --fallback, -f  Set fallback for new version        [required] [default: true]
```

**publish** command will read `stats.json` file in `output`, combines `publicPath` with `filename` of assets and sent to registry server. The command will only works if `publishConfig` is defined.
