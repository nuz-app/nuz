import fs from 'fs-extra'

import * as paths from '../paths'

import print from './print'

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
    const resolvePackageJson = paths.resolvePackageJson(directory)
    if (!fs.existsSync(resolvePackageJson)) {
      throw new Error(
        `Not found package.json file in directory at ${print.dim(directory)}.`,
      )
    }

    packageJsons[directory] = require(resolvePackageJson)
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
