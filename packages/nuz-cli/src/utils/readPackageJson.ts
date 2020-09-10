import fs from 'fs-extra'

import * as paths from '../paths'

export interface PackageJson {
  [key: string]: any
  name: string
  version: string
  browserslist: any
  dependencies: { [id: string]: string }
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
let packageJsons = {} as { [key: string]: PackageJson }

function readPackageJson(directory: string): PackageJson {
  if (!packageJsons[directory]) {
    const packageJsonPath = paths.resolvePackageJson(directory)
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(
        `Not found package.json file in directory at ${directory}`,
      )
    }

    packageJsons[directory] = require(packageJsonPath)
  }

  return packageJsons[directory]
}

readPackageJson.clearCaches = function cleaCaches(directory?: string) {
  if (directory === undefined) {
    packageJsons = {}
  } else {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete packageJsons[directory]
  }
}

export default readPackageJson
