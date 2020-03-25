# Contributing

## Commit conventions

Should be commit with message:
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
