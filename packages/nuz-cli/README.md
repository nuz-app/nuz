# @nuz/cli &middot; [![npm version](https://img.shields.io/npm/v/@nuz/cli.svg?style=flat)](https://www.npmjs.com/package/@nuz/cli) ![npm downloads](https://img.shields.io/npm/dw/@nuz/cli)

## About

[@nuz/cli](#) is a tool to help create, develop, build, serve and publish a module in the simplest way. You can think of it as a [create-react-app](#) or [creact-next-app](#) but to create a library instead of an application.
The [@nuz/cli](#) is recommended for the Nuz ecosystem, but if you want to use it independently for any other purpose, it's still possible!

### Keys features

- ⚡️ Quickly create a standard module.
- 🔬 Support development mode for standalone and workspace.
- 📦 Support bundle auto optimized code and minify code size for production.
- 🗂 File serving and directory listing in the module.
- 💅 Styling is supporting CSS, Less, and Sass. Auto css modules by name.
- 🔷 SVG is supporting as React Component or static file.
- 🏞 Image imports are supported. Auto convert base64 or static files.
- 🏷 Easy publish to a module to the registry server using [@nuz/registry](#).
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
3. Run `nuz create`, and answers the question, [read more](#).
4. Done. You can now dev, build, and deploy with the suggestions displayed!

### Commands

#### `nuz create`

Create a module in the Micro Frontends project.

#### `nuz dev`

Run standalone development mode.

#### `nuz build`

Bundle auto optimized code and minify code size for production.

#### `nuz serve`

File serving and directory listing in the module.

#### `nuz workspace`

Run workspace development mode.

#### `nuz publish`

Publish module to the registry server.

## Documentation

Update soon! 📝
