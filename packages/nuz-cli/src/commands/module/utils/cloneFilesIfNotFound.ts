import path from 'path'

import * as paths from '../../../paths'
import * as fs from '../../../utils/fs'

const filesMap = {
  '.gitignore': 'gitignore',
  'package.json': 'package.json',
} as { [file: string]: string }

const cloneFilesIfNotFound = (dir: string, files: string[]) =>
  Promise.all<any>(
    files.map((file) => {
      const filePath = path.join(dir, file)
      const isExisted = fs.exists(filePath)
      const sample = filesMap[file]
      if (isExisted || !sample) {
        return true
      }

      return fs.copy(paths.inTemplate(sample), filePath)
    }),
  )

export default cloneFilesIfNotFound
