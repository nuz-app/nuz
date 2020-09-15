import fs from 'fs-extra'
import path from 'path'

import * as paths from '../../../paths'

const filesMap = {
  '.gitignore': 'gitignore',
  'package.json': 'package.json',
} as { [file: string]: string }

async function ensureImportantsFiles(
  directory: string,
  files: string[],
): Promise<any> {
  return Promise.all<any>(
    files.map((file) => {
      const filePath = path.join(directory, file)
      const isExisted = fs.existsSync(filePath)
      const sample = filesMap[file]
      if (isExisted || !sample) {
        return true
      }

      return fs.copy(paths.resolveTemplates(sample), filePath)
    }),
  )
}

export default ensureImportantsFiles
