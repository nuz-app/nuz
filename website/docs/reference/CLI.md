---
id: cli
title: Command-line interface (CLI)
description: \@nuz\/cli is a command-line interfaces to manage modules and interact with the registry server.
image: images/posts/cli-cover.png
keywords:
  - nuz
  - cli
  - dev
  - build
  - registry
  - serve
  - scope
  - module
  - compose
  - user
  - config
  - tools
  - status
---

:::note

Command-line interface (CLI) is alias for [@nuz/cli](https://github.com/nuz-app/nuz/tree/next/packages/nuz-cli).

:::

...

## dev

Start the development mode for the module(s).

```bash
nuz dev
```
                                  
## build

Start build optimized mode for production.

```bash
nuz build
```
                                  
## serve

File serving and directory listing in the module.

```bash
nuz serve
```
                                  
## scope

Manage the scope.

### list 

Alias: [user-my-scopes](#scopes).

```bash
nuz scope list
```

### get <scope\> \[fields..\]

Get scope details.

```bash
nuz scope <scope> [fields..]
```

### create <name\>

Create the new scope.

```bash
nuz scope create <name>
```

### delete <name\>

Delete a scope.

```bash
nuz scope delete <name>
```

### collaborator

Manage the scope collaborators.

#### add <scope\> <user\> \[type\]

Add new collaborator to the list.

```bash
nuz scope collaborator add <scope> <user> [type]
```

#### update <scope\> <user\> \[type\]

Update the collaborator information.

```bash
nuz scope collaborator update <scope> <user> [type]
```

#### remove <scope\> <user\> \[type\]

Remove a collaborator from the list.

```bash
nuz scope collaborator remove <scope> <user> [type]
```

#### list <scope\>

Show all collaborators in the list.

```bash
nuz scope collaborator list <scope>
```

## module

Manage the module.

### list 

Alias: [user-my-modules](#modules-1).

```bash
nuz module list
```

### create \[name\] \[template\]

Create the new module.

```bash
nuz module create [name] [template]
```

### get <module\> \[fields..\]

Get module details.

```bash
nuz module get <module> [fields..]
```

### publish \[fallback\]

Publish the new module version.

```bash
nuz module publish [fallback]
```

### collaborator

Manage the module collaborators.

#### add <module\> <user\> \[type\]

Add new collaborator to the list.

```bash
nuz module collaborator add <module> <user> [type]
```

#### update <module\> <user\> \[type\]

Update the collaborator information.

```bash
nuz module collaborator update <module> <user> [type]
```

#### remove <module\> <user\> \[type\]

Remove a collaborator from the list.

```bash
nuz module collaborator remove <module> <user> [type]
```

#### list <module\>

Show all collaborators in the list.

```bash
nuz module collaborator list <module>
```

### deprecate <module\> <versions\> \[deprecate\]

Update the module deprecate.

```bash
nuz module deprecate <module> <versions> [deprecate]
```

## create \[name\] \[template\] 

Alias: [module-create](#create-name-template).

```bash
nuz create [name] [template]
```

## publish \[fallback\] 

Alias: [module-publish](#publish-fallback).

```bash
nuz publish [fallback]
```

## compose

Manage the compose.

### list 

Alias: [user-my-composes](#composes).

```bash
nuz compose list
```

### get <compose\> \[fields..\]

Get compose details.

```bash
nuz compose get <compose> [fields..]
```

### create <name\>

Create the new compose.

```bash
nuz compose create <name>
```

### delete <name\>

Delete a compose.

```bash
nuz compose delete <name>
```

### collaborator

Manage the compose collaborators.

#### add <compose\> <user\> \[type\]

Add new collaborator to the list.

```bash
nuz compose collaborator add <compose> <user> [type]
```

#### update <compose\> <user\> \[type\]

Update the collaborator information.

```bash
nuz compose collaborator update <compose> <user> [type]
```

#### remove <compose\> <user\> \[type\]

Remove a collaborator from the list.

```bash
nuz compose collaborator remove <compose> <user> [type]
```

#### list <compose\>

Show all collaborators in the list.

```bash
nuz compose collaborator list <compose>
```

### modules

Manage the modules in a compose.

#### set <compose\> <modules..\> 

Add modules to the compose.

```bash
nuz modules set <compose> <modules..>
```

#### remove <compose\> <module-ids..\>

Remove modules from the compose.

```bash
nuz modules remove <compose> <modules-ids..>
```

## user

Manage the user.

### whoami

Who I am?

```bash
nuz user whoami
```

### login

Sign in to your user.

```bash
nuz user login
```

### logout \[username\]

Sign out of this user.

```bash
nuz user logout [username]
```

### register

Create the new user.

```bash
nuz user register
```

### list

Show the list of logged-in users.

```bash
nuz user list
```

### use <username\>

Switch to another logged-in user.

```bash
nuz user use <username>
```

### token

Manage the tokens of current user.

#### create <type\>

Create new token for current user.

```bash
nuz user token create <type>
```

#### delete <token\>

Delete a token from current user.

```bash
nuz user token delete <token>
```

### my

Show the list of current user.

#### composes

Show the list composes of current user.

```bash
nuz user my composes
```

#### scopes

Show the list scopes of current user.

```bash
nuz user my scopes
```

#### modules

Show the list modules of current user.

```bash
nuz user my modules
```

## whoami 

Alias: [user-whoami](#whoami).

```bash
nuz whoami
```

## login \[username\] 

Alias: [user-login](#login).

```bash
nuz login
```

## logout \[username\] 

Alias: [user-logout](#logout-username).

```bash
nuz logout [username]
```

## register 

Alias: [user-register](#register).

```bash
nuz register
```

## use <username\> 

Alias: [user-use](#use-username).

```bash
nuz use <username>
```

## config

Manage the configuration.

### set <key\> <value\>

Set configuration.

```bash
nuz config set <key> <value>
```

### get <keys..\>

Get configuration.

```bash
nuz config get <keys..>
```

### list

List configuration.

```bash
nuz config list
```

## tools

Support tools.

### check-update

Check update for the package.

```bash
nuz tools check-update
```

### status

Check the system status.

```bash
nuz tools status
```

## status 

Alias: [tools-status](#status).

```bash
nuz status
```

## others

### --version

Show current version.

```bash
nuz --version
```

### --help

Show help.

```bash
nuz --help
```
