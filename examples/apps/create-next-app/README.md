# Nuz + Next.js (with-typescript)

The template is [with-typescript](https://github.com/zeit/next.js/tree/canary/examples/with-typescript) created by [creact-next-app](https://github.com/zeit/next.js).

## What is different?

- Installed [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core) as `dependencies` and [@nuz/cli](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-cli) as `devDependencies`.
- Add script `dev-workspace` in package.json.
- A new folder named `workspace` includes `modules` created by [@nuz/cli](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-cli).
- File `pages/_app.tsx` default of next with some config for [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core).
- Updated `next.config.js` file to use helper of [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core) for [Next.js](https://github.com/zeit/next.js), support **server-side-rendering**.
- Updated `pages/index.tsx` file to use [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core).

## Getting started

### Installation

Run install in `root` dir and `workspace/hello-world` dir same below command:
```sh
# with npm
$ npm install

# or yarn
$ yarn install
```

### Scripts

#### Start development mode

You just run 2 scripts below:

##### Start dev app:
```sh
# with npm
$ npm run dev

# or yarn
$ yarn dev
```

##### Start workspace mode of `@nuz/core`:
```sh
# with npm
$ npm run dev-workspace

# or yarn
$ yarn dev-workspace
```

#### Builds the app for production:
```sh
# with npm
$ npm run build

# or yarn
$ yarn build
```

#### Start production mode
```sh
# with npm
$ npm run start

# or yarn
$ yarn start
```

### Deployment

For production builds, you need to run (the app will be build into the `.next` folder):
```sh
# with npm
$ npm run build

# or yarn
$ yarn build
```

Start the app for production:
```sh
# with npm
$ npm run start

# or yarn
$ yarn start
```

#### Deploy your own

##### Now

Deploy the example using [ZEIT Now](https://zeit.co/now):

[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/nuz-app/nuz/tree/develop/examples/apps/create-next-app)

_Live Example: https://create-next-app.nuz.now.sh_

## Good luck! 👍
