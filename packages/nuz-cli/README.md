# @nuz/cli &middot; [![npm version](https://img.shields.io/npm/v/@nuz/cli.svg?style=flat)](https://www.npmjs.com/package/@nuz/cli) ![npm downloads](https://img.shields.io/npm/dm/@nuz/cli)

## About

[@nuz/cli](#) is a tool to help create, develop, build, serve and publish a module in the simplest way. You can think of it as a [create-react-app](https://create-react-app.dev) or [create-next-app](https://github.com/zeit/next.js) but to create a library instead of an application.
The [@nuz/cli](#) is recommended for the Nuz ecosystem, but if you want to use it independently for any other purpose, it's still possible!

### Keys features

- ⚡️ Quickly create a standard module.
- 🔬 Support development mode for standalone and workspace.
- 📦 Support bundle auto optimized code and minify code size for production.
- 🗂 File serving and directory listing in the module.
- 💅 Styling is supporting CSS, Less, and Sass. Auto css modules by name.
- 🔷 SVG is supporting as React Component or static file.
- 🏞 Image imports are supported. Auto optimize and convert base64 or static files by size.
- 🏷 Easy publish to a module to the registry server using [@nuz/registry](https://github.com/lamhieu-vk/nuz/tree/develop/packages/nuz-registry).
- 🚨Rollback quickly when encountering problems.

## Usage

### Installation

You can easily install it with `yarn` or `npm`, but there are a few things to note:
- When you run the command `create`, the [@nuz/cli](#) will be called as **global**.
- When you invoke the workspace command, the [@nuz/cli](#) called is located in the **master app**.
- In all other cases, the [@nuz/cli](#) called will be on the **module itself**.
- You should install [@nuz/cli](#) in `devDependencies`.

Install [@nuz/cli](#) as **global** with the following command:
```sh
# with npm
$ npm install @nuz/cli -g

# or yarn
$ yarn global add @nuz/cli
```

Install [@nuz/cli](#) as located in the **master app** or **module itself**, run the command as root folder:
```sh
# with npm
$ npm install @nuz/cli --save-dev

# or yarn
$ yarn add @nuz/cli -D
```

### Getting started

How to create and get started on a project?
1. Install [@nuz/cli](#) as global, see above.
2. Go to the directory you want to contain the project
3. Run `nuz create`, and answers the question, [read more](#nuz-create).
4. Done. You can now dev, build, and deploy with the suggestions displayed!

### Commands

#### `nuz create`

Create a module in the Micro Frontends project.

#### `nuz dev`

Run standalone development mode.

#### `nuz build`

Bundle with auto optimized.

#### `nuz serve`

File serving and directory listing in the module.

#### `nuz workspace`

Run workspace development mode.

#### `nuz publish`

Publish module to the registry server.

## Documentation

With the characteristics of a module that works for the Micro Frontends project, [@nuz/cli](#) has some customizations but in general it still uses Webpack and its features to do this, and you don't care much about configuration. build for Webpack when using [@nuz/cli](#).

Some requirements for an Micro Frontends module:
- Export library as umd format, which may be expanded in the future.
- Supports both server-side and client-side environments.
- Use some vendors packages from master app.

Some additional extras used by [@nuz/cli](#) with [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/develop/packages/nuz-core):
- Access in a safer context instead of global.
- Support shared dependencies between modules with lazy-load.
- Support split vendors dependencies automatically.
- Support for optimizing code and reducing code size.
- Supports styling settings with CSS, CSS modules, Sass, Less!
- Support importing images files.
- Support importing svg files.

These do not need additional configuration, will work with basic customizations if you need them!

### Configuration file

This is the configuration file used by CLI to read your configuration for modules, it is named `nuz.config.js` and contains in the root directory. For example:
```ts
// nuz.config.js

// Main fields load from './package.json'
// Such as: name, version, library, source -> input, main -> output.
module.exports = ({
  "feature": true,
  "publicPath": "/"
})
```

Configuration allowed:
```ts
export interface ModuleConfig {
  /**
   * Name of module
   */
  name: string
  /**
   * Version of module
   */
  version: string
  /**
   * Library name
   */
  library: string
  /**
   * Input file
   */
  input: string
  /**
   * Output file
   */
  output: string
  /**
   * Public path using in build, default: '/'
   */
  publicPath: string
  /**
   * Set devtool
   */
  devtool?: webpack.Options.Devtool
  /**
   * Extends externals module
   */
  externals?: { [moduleName: string]: string }
  /**
   * Enable feature by loader and plugins
   */
  feature?: boolean | FeatureConfig
  /**
   * Bundle analyzer for production mode
   */
  analyzer?: boolean | AnalyzerConfig
  /**
   * Allow to custom webpack config
   */
  webpack?: (
    config: webpack.Configuration,
  ) => Required<
    Pick<
      webpack.Configuration,
      'name' | 'mode' | 'target' | 'entry' | 'output' | 'module'
    >
  >
  /**
   * Publish config
   */
  registry?: RegistryConfig
  /**
   * Workspace paths
   */
  workspace?: string[]
  /**
   * Shared dependencies module used
   */
  shared?: string[]
  /**
   * Serve config
   * Config using for dev, serve and workspace mode
   */
  serve?: ServeConfig
  /**
   * Experimental
   */
  experimental?: ExperimentalConfig
}
```

Note that, besides this file, CLI also reads some fields in `package.json` file

| package.json | nuz.config.js |
|--------------|---------------|
| `name`       | `name`        |
| `version`    | `version`     |
| `library`    | `library`     |
| `source`     | `input`       |
| `main`       | `output`      |

### Vendors dependencies

Some singleton or main dependencies that need to be used together are `react`, `react-dom`, `@nuz/core`, `redux`, etc... They need to be used at the externals of the Master app. The applications are vendors dependencies you need to install at `peerDependencies`. [@nuz/cli](#) will do the rest for you.

### Shared dependencies

Some of the dependencies you'll probably use are common among modules, the best way to optimize them is to share resources. The CLI helps you do it without being too complicated, shared resources will only be downloaded when any module using it is called.

Add the `shared` field to your configuration file in the modules, which is a list of array of dependencies you use together, for example:
```ts
// nuz.config.js
module.exports = ({
  ...
  "shared": ["lodash"],
})
```

Add the `shared` field to your bootstrap config in the master app, for example:
```ts
bootstrap({
  ...
  shared: {
    ...
    lodash: () => import('lodash'),
  },
});
```
*Note: this is an object that contains the keys on the shared dependencies and returns a dynamic import function (to download only when needed).*


*Updating...*
