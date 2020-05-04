# Contributing

We are happy with your help in making the Nuz project better. Please read the project overview and guidelines for contributing bug reports and new code, or it might be hard for the community to help you with your issue or pull request.

## 📃 Overview

Before we jump into detailed guidelines for opening and triaging issues and submitting pull requests, here is some information about how our project is [structured and resources](https://github.com/nuz-app/nuz/tree/develop/docs) you should refer to as you start contributing.

## 📎 Project roles

### Reviewer

If you having submit a pull request, you can assign a reviewer is any members below to review and merge your pull request.

* [@lamhieu-vk](https://github.com/lamhieu-vk)

### Core Committer

The contributors with commit access and release to Nuz project. If you want to become a core committer please start writing PRs.

* [@lamhieu-vk](https://github.com/lamhieu-vk)

## 🔽 Submitting pull requests

Once you've come up with a good design, go ahead and submit a pull request (PR). When submitting a PR, please follow these guidelines:
* Base all your work off of the `develop` branch. The `develop` branch is where active development happens. 
  *Note: we do not merge pull requests directly into master.*
* Limit yourself to one feature or bug fix per pull request.
* Should include tests that prove your code works.
* Follow appropriate style for code contributions and [commit messages](https://github.com/nuz-app/nuz/blob/develop/CONTRIBUTING.md#commit-conventions).
* Be sure your author field in git is properly filled out with your full name and email address so we can credit you.

If your pull request is working in process or not ready to merge, please add `WIP:` prefix in pull request name.

## 📝 Commit conventions

Nuz is using [conventional commits](https://www.conventionalcommits.org), you can enter commit with the message:
```sh
type(scope): commit message
```

Example:
```sh
$ git commit -m "fix(nuz-cli): not found workspace in config"
```

##### Allowed `type` values:
* **feat** - new feature, not a new feature for build script.
* **fix** - bug fix, not a fix to a build script.
* **docs** - changes to the documentation.
* **meta** - formatting, missing semi colons, etc; no production code change.
* **refactor** - refactoring production code, eg. renaming a variable.
* **test** - adding missing tests, refactoring tests, no production code change.
* **chore** - updating grunt tasks etc, no production code change.
* **ci** - ci configure.
* **perf** - a code change that improves performance.

##### Example `scope` values:
* `nuz-shared` - change in `@nuz/shared`.
* `nuz-utils` - change in `@nuz/utils`.
* `nuz-core` - change in `@nuz/core`.
* `nuz-cli` - change in `@nuz/cli`.
* `nuz-registry` - change in `@nuz/registry`.
* `empty` - not defined or included multiple parties.
* etc.
