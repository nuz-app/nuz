# Nuz + create-react-app

The template created by [create-react-app](https://www.npmjs.com/package/create-react-app).

## What is different?

- Installed [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core) [react-helmet](https://www.npmjs.com/package/react-helmet) as `dependencies` and [@nuz/cli](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-cli) as `devDependencies`.
- Add script `dev-workspace` in package.json.
- A new folder named `workspace` includes `modules` created by [@nuz/cli](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-cli).
- Updated `src/client.js` file to bootstrap in-app.
- Updated `src/App.js` file to use [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core).

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

You can get started quickly with the following script.

#### Start development mode

You just run 2 scripts below:

##### Start the app:
```sh
# with npm
$ npm run start

# or yarn
$ yarn start
```

##### Start workspace mode of [@nuz/core](https://github.com/nuz-app/nuz/tree/develop/packages/nuz-core):
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


### Deployment

For production builds, you need to run (the app will be build into the `build` folder):
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

[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/nuz-app/nuz/tree/develop/examples/apps/create-react-app)

_Live Example: https://create-react-app.nuz.now.sh_

## Good luck! 👍

