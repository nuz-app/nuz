---
id: concepts
title: Concepts
keywords:
  - nuz
  - architecture
  - concepts
  - definition
  - package-manager
  - workflow
  - packages
  - core
  - cli
  - registry
  - node
---

As libraries in general and package manager in particular. In order to get the most out of the process of using and contributing to the project, you need to understand the principle of operation and its basic concepts.

## Definitions

### Package manager

A package manager or package-management system is a collection of software tools that automates the process of installing, upgrading, configuring, and removing computer programs for a computer's operating system in a consistent manner.

A package manager deals with packages, distributions of software and data in archive files. Packages contain metadata, such as the software's name, description of its purpose, version number, vendor, checksum (preferably a cryptographic hash function), and a list of dependencies necessary for the software to run properly. Upon installation, metadata is stored in a local package database. Package managers typically maintain a database of software dependencies and version information to prevent software mismatches and missing prerequisites. They work closely with software repositories, binary repository managers, and app stores.

*Source: [Package manager from Wikipedia](https://en.wikipedia.org/wiki/Package_manager).*

#### The difference

The difference between Nuz and the rest of the world is that Nuz is a dynamic package manager. It follows the same concepts and functions as any other manager, but there are a few different factors. Those factors can be beneficial or limited, depending on the use case to decide and consider whether static or dynamic.

More about its differences, instead of like any other manager, when you want to use a package, you need to install it first. By calling install, it downloads the package binaries from the registry to locally. Every time you call **require** or **import** it in the code, it will resolve the package locally, when you need to bundle your app, you need to bundle all the libraries locally into the app bundle and when you don't use it anymore, you need to delete it locally.

With Nuz, you don't need to perform an installation before using it, it means you don't need to download binrary locally. Only when the **require** or **import** command is called will Nuz download and initialize the package. Tthat process is do at runtime and you don't need to bundle it in your app, when you need to update you don't need to bundle it again.

### Registry

...

#### Forget node_modules

...

### Module

...

## How do it works?

...

## Main packages

...

### Core

...

### CLI

...

### Registry

...
