import path from 'path'

import * as fs from '../../utils/fs'
import getPathInTemplate from '../../utils/getPathInTemplate'

const filesMap = {
  '.gitignore': 'gitignore',
  'package.json': 'package.json',
}

const cloneFilesIfNotFound = (dir: string, files: string[]) =>
  Promise.all(
    files.map(file => {
      const filePath = path.join(dir, file)
      const isExisted = fs.exists(filePath)
      const sample = filesMap[file]
      if (isExisted || !sample) {
        return true
      }

      return fs.copy(getPathInTemplate(sample), filePath)
    }),
  )

export default cloneFilesIfNotFound
