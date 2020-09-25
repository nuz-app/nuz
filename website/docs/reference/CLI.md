---
id: cli
title: Command-line interface (CLI)
---

:::note

Command-line interface (CLI) is alias for [@nuz/cli](https://github.com/nuz-app/nuz/tree/next/packages/nuz-cli).

:::

...

## dev

Start the development mode for the module(s).
                                  
## build

Start build optimized mode for production.
                                  
## serve

File serving and directory listing in the module.
                                  
## scope

Manage the scope.

### list 

Alias: [user-my-scopes](#scopes).

### get <scope\> \[fields..\]

Get scope details.

### create <name\>

Create the new scope.

### delete <name\>

Delete a scope.

### collaborator

Manage the scope collaborators.

#### add <scope\> <user\> \[type\]

Add new collaborator to the list.

#### update <scope\> <user\> \[type\]

Update the collaborator information.

#### remove <scope\> <user\> \[type\]

Remove a collaborator from the list.

#### list <scope\>

Show all collaborators in the list.

## module

Manage the module.

### list 

Alias: [user-my-modules](#modules-1).

### create \[name\] \[template\]

Create the new module.

### get <module\> \[fields..\]

Get module details.

### publish \[fallback\]

Publish the new module version.

### collaborator

Manage the module collaborators.

#### add <module\> <user\> \[type\]

Add new collaborator to the list.

#### update <module\> <user\> \[type\]

Update the collaborator information.

#### remove <module\> <user\> \[type\]

Remove a collaborator from the list.

#### list <module\>

Show all collaborators in the list.

### deprecate <module\> <versions\> \[deprecate\]

Update the module deprecate.

## create \[name\] \[template\] 

Alias: [module-create](#create-name-template).

## publish \[fallback\] 

Alias: [module-publish](#publish-fallback).

## compose

Manage the compose.

### list 

Alias: [user-my-composes](#composes).

### get <compose\> \[fields..\]

Get compose details.

### create <name\>

Create the new compose.

### delete <name\>

Delete a compose.

### collaborator

Manage the compose collaborators.

#### add <compose\> <user\> \[type\]

Add new collaborator to the list.

#### update <compose\> <user\> \[type\]

Update the collaborator information.

#### remove <compose\> <user\> \[type\]

Remove a collaborator from the list.

#### list <compose\>

Show all collaborators in the list.

### modules

Manage the modules in a compose.

#### set <compose\> <modules..\> 

Add modules to the compose.

#### remove <compose\> <module-ids..\>

Remove modules from the compose.

## user

Manage the user.

### whoami

Who I am?

### login

Sign in to your user.

### logout \[username\]

Sign out of this user.

### register

Create the new user.

### list

Show the list of logged-in users.

### use <username\>

Switch to another logged-in user.

### token

Manage the tokens of current user.

### my

Show the list of current user.

#### composes

Show the list composes of current user.

#### scopes

Show the list scopes of current user.

#### modules

Show the list modules of current user.

## whoami 

Alias: [user-whoami](#whoami).

## login \[username\] 

Alias: [user-login](#login).

## logout \[username\] 

Alias: [user-logout](#logout-username).

## register 

Alias: [user-register](#register).

## use <username\> 

Alias: [user-use](#use-username).

## config

Manage the configuration.

### set <key\> <value\>

Set configuration.

### get <keys..\>

Get configuration.

### list

List configuration.

## tools

Support tools.

### check-update

Check update for the package.

### status

Check the system status.

## status 

Alias: [tools-status](#status).

## others

### --version

Show current version.

### --help

Show help.
