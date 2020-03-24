## @nuz/core
***

**@nuz/core** is core to define and resolve externals modules, implement as a worker for micro-frontends.

* ****

### Installation

Easy to install **@nuz/core**, you can use `yarn` or `npm`.

```bash
# install by yarn
$ yarn add @nuz/core

# install by npm
$ npm install @nuz/core
```

Please only install **@nuz/core** on master module, you can use **@nuz/core** in other modules but install as peer dependencies.

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
  registry?: {
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
  --port, -p  Set port listen for server                                           [number]
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

File serving and directory listing in module

Options:
  --port, -p  Set port listen for server                                           [number]
```

**serve** command will serve resource in `output` dir of module.

### Publish

```bash
nuz publish

Publish version for module

Options:
  --fallback, -f  Set fallback for new version        [required] [default: true]
```

**publish** command will read `stats.json` file in `output`, combines `publicPath` with `filename` of assets and sent to registry server. The command will only works if `registry` is defined.
