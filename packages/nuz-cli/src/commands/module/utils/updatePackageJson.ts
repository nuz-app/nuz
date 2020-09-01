import { getPackageJsonInDirectory } from '@nuz/utils'
import path from 'path'

import * as fs from '../../../utils/fs'

interface ModuleInfo {
  name: string
  version: string
  library?: string
}

const updatePackageJson = async (dir: string, info: ModuleInfo) => {
  const packageJsonPath = path.join(dir, 'package.json')
  const packageJson = getPackageJsonInDirectory(dir) || {}

  const {
    name: _name,
    library: _library,
    version: _version,
    ...rest
  } = packageJson
  const { name, library, version } = info

  fs.writeJson(
    packageJsonPath,
    Object.assign({ name, version }, library && { library }, rest),
  )
}

export default updatePackageJson
