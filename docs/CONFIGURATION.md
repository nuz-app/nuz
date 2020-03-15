### Configuration

In root folder of [master app](#) or [module](#) having a file named `nuz.config.js`, this is a config file. **@nuz/cli** will read this file to get defined values.

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

  // Using in master app, it defined paths of local modules link to develop
  // Only use to resolve in development mode
  workspace?: [],
})
```
