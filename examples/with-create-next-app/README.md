# Nuz + Netx.js (with-typescript)

The template is [with-typescript](https://github.com/zeit/next.js/tree/canary/examples/with-typescript) created by [creact-next-app](https://github.com/zeit/next.js).

## What is different?

- Installed `@nuz/core` as `dependencies` and `@nuz/cli` as `devDependencies`.
- Add script `dev-workspace` in package.json.
- A new folder named `workspace` includes `modules` created by [@nuz/cli](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-cli).
- File `pages/_app.tsx` default of next with some config for [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core).
- Updated `next.config.js` file to use helper of [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core) for [Next.js](https://github.com/zeit/next.js), support **server-side-rendering**.
- Updated `pages/index.tsx` file to use [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/master/packages/nuz-core).

## Getting started

### Installation

Run install in `root` dir and `workspace/hello-world` dir same below command:
```sh
# with npm
$ npm install

# or yarn
$ yarn install
```

### Start development mode

You just run 2 scripts below:

##### Start dev mode of `next.js`:
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

## Good luck! 👍

