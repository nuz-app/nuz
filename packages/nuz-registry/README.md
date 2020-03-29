# @nuz/registry &middot; [![npm version](https://img.shields.io/npm/v/@nuz/registry.svg?style=flat)](https://www.npmjs.com/package/@nuz/registry)

## Installation

To install **@nuz/registry** package, you just run below command:
```sh
# with npm
$ npm install @nuz/registry

# or yarn
$ yarn add @nuz/registry
```

## Usage

Create a registry server:
```js
const registry = require('@nuz/registry');

(async function main() {
  const server = new registry.Server({
    key: 'secret-key',
    db: {
      type: 'mongodb',
      url: 'mongodb://localhost:27017/registry',
    },
  });

  await server.prepare();

  server.listen(4004);
})();
```

Example using `express` middlewares:
```js
(async function main() {
  const server = new registry.Server(...);

  await server.middlewares(async (app) => {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    app.use(cors());
  });

  await server.prepare();
})();
```

### Recommendation

See [example](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-registry/examples/registry-server).

## Documentation

### `Server`

Create a server
```ts
new registry.Server(
  // ServerOptions
)
```
#### ServerOptions

```ts
export interface ServerOptions {
  key: string
  db: DBOptions
  https?: boolean | HttpsConfig
  compression?: boolean | compression.CompressionOptions
  serverless?: ServerlessOptions
}
```

##### `key: string`
This is master key, using to verify before handle `token`.

##### `db: DBOptions`
`DBOptions` is object having
```js
const { type, ...rest } = db
```

* `type` is set database want to used. Currently, only `mongodb` is supported.
* `...rest` is pass all other values to constructor while create DB class.

If type is `mongodb` please add `url` as MongoDB url.

##### `https: boolean | HttpsConfig`
Default is `false`.

Provide https config for your registry server. If set is `true`, [@nuz/registry](#) will auto generate self certificate to use https connect method.
```ts
export interface HttpsConfig {
  key: Buffer | string
  cert: Buffer | string
}
```

[@nuz/registry](#) use [spdy](https://www.npmjs.com/package/spdy) to handle on *https* and *http2*.

*Note: Please only use `true` for `localhost`, in development mode. In proudction, please provide your certificate!*

##### `compression?: boolean | compression.CompressionOptions`
Default is `true`.

[@nuz/registry](#) use [compression](https://www.npmjs.com/package/compression) to compress. Set is `true` will use default with default config, you can also pass `compression.CompressionOptions`!

##### `serverless?: ServerlessOptions`

Pass options to route handler.

**Tip**: `fetch` route is support cache, you ca use it by config:

```ts
serverless: {
  ...
  fetch: {
    cacheTime: 300000, // 5m, cache time
    prepareTime: 60000, // 1m, prepare time
  }
}
```
