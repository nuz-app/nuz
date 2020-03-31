# Nuz + create-react-app

The template created by [create-react-app](https://www.npmjs.com/package/create-react-app).

## What is different?

- Installed `@nuz/core` `react-helmet` as `dependencies` and `@nuz/cli` as `devDependencies`.
- Add script `dev-workspace` in package.json.
- A new folder named `workspace` includes `modules` created by [@nuz/cli](https://github.com/lamhieu-vk/nuz/tree/develop/packages/nuz-cli).
- Updated `src/client.js` file to bootstrap in-app.
- Updated `src/App.js` file to use [@nuz/core](https://github.com/lamhieu-vk/nuz/tree/develop/packages/nuz-core).

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

##### Start dev mode of `react-scripts`:
```sh
# with npm
$ npm run start

# or yarn
$ yarn start
```

##### Start workspace mode of `@nuz/core`:
```sh
# with npm
$ npm run dev-workspace

# or yarn
$ yarn dev-workspace
```

## Good luck! 👍

