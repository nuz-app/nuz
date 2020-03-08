import os from 'os'
import path from 'path'

import * as fs from '../../utils/fs'
import getPackageJsonInDir from '../../utils/getPackageJsonInDir'

interface ModuleInfo {
  name: string
  library: string
  version: string
}

const updatePackageJson = async (dir: string, info: ModuleInfo) => {
  const packageJsonPath = path.join(dir, 'package.json')
  const packageJson = getPackageJsonInDir(dir) || {}

  const {
    name: _name,
    library: _library,
    version: _version,
    ...rest
  } = packageJson
  const { name, library, version } = info

  fs.writeJson(packageJsonPath, { name, library, version, ...rest })
}

export default updatePackageJson
