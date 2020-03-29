# @nuz/cli &middot; [![npm version](https://img.shields.io/npm/v/@nuz/cli.svg?style=flat)](https://www.npmjs.com/package/@nuz/cli) ![npm downloads](https://img.shields.io/npm/dw/@nuz/cli)

## Installation

Easy to install [@nuz/cli](#) with command:
```sh
# with npm
$ npm install @nuz/cli --save-dev

# or yarn
$ yarn add @nuz/cli -D
```

After install, run command to check version of [@nuz/cli](#):
```sh
$ nuz --version
```

Get help:
```sh
$ nuz --help
nuz [command]

Commands:
  nuz create     Create a module for micro frontends project
  nuz dev        Run development mode
  nuz build      Run build production mode
  nuz serve      File serving and directory listing in module
  nuz publish    Publish version for module
  nuz workspace  Start development mode in workspace

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Usage

The [@nuz/cli](#) commands below will only works while calling in root directory of the module.
When [@nuz/cli](#) called, it will find `nuz.config.js` file to read config, read more [here](https://github.com/lamhieu-vk/nuz/tree/develop/docs#configuration).

### Commands

#### `nuz create`

Create a module for micro frontends project.
```sh
$ nuz create

Options:
  --name, -n      Module name                             [string]
  --template, -t  Module template                         [string]
```

#### `nuz dev`

Run development mode.
```sh
$ nuz dev

Options:
  --port, -p  Set port listen for server                  [number]
```

#### `nuz build`

Run build production mode.
```sh
$ nuz build

Options:
  --clean, -c  Clean dist                                 [number] [default: true]
```

#### `nuz serve`

File serving and directory listing in module.
```sh
$ nuz serve

Options:
  --port, -p  Set port listen for server                  [number]
```

#### `nuz publish`

Publish version for module.
```sh
$ nuz publish

Options:
  --fallback, -f  Set fallback version                    [required] [default: true]
```

#### `nuz workspace`

*Note: Unlike the above commands, this command is only called in the root directory of the master app.*

Start development mode in workspace.
```sh
$ nuz workspace

Options:
  --workspace, -w  Module paths to link                   [array]
  --port, -p       Set port listen for server             [number]
```
