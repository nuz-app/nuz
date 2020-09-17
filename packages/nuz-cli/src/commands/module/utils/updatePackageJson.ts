import { omit } from '@nuz/utils'
import fs from 'fs-extra'

import * as paths from '../../../paths'
import readPackageJson from '../../../utils/readPackageJson'

interface ModuleInfo {
  name: string
  version: string
  library?: string
}

async function updatePackageJson(
  directory: string,
  info: ModuleInfo,
): Promise<any> {
  //
  readPackageJson.clearCaches(directory)

  const packageJson = readPackageJson(directory)
  const resolvePackageJson = paths.resolvePackageJson(directory)

  const { name, library, version } = info

  await fs.writeFile(
    resolvePackageJson,
    JSON.stringify(
      Object.assign(
        { name, version },
        library && { library },
        omit(packageJson, ['name', 'library', 'version']),
      ),
      null,
      2,
    ),
  )
}

export default updatePackageJson
