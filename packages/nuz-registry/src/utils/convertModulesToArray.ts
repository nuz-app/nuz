import { validator, versionHelpers } from '@nuz/utils'

import { ModuleAsObject } from '../types'

function convertModulesToArray(modulesAsObject: ModuleAsObject) {
  const modules = Object.entries(modulesAsObject).map(([id, version]) => ({
    id,
    version,
  }))

  for (const item of modules) {
    if (!validator.moduleId(item.id)) {
      throw new Error(`${item.id} is invalid module id.`)
    }

    if (
      !versionHelpers.checkIsValid(item.version) &&
      !validator.tag(item.version)
    ) {
      throw new Error(`${item.version} is invalid module version and tag.`)
    }
  }

  return modules
}

export default convertModulesToArray
