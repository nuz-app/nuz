import { assetsUrlHelpers, hashFile } from '@nuz/utils'

import {
  OTHER_FILE_SIZE_LIMIT,
  SOURCE_CODE_FILE_SIZE_LIMIT,
  SOURCE_MAP_FILE_SIZE_LIMIT,
  TOTAL_FILE_SIZE_LIMIT,
} from '../lib/const'
import { ModuleId } from '../types'

export interface TransformFile {
  fileName: string
  originalName: string
  assetPath: string
  tempPath: string
  mimeType: string
  encoding: string
  size: number
  md5sum: string
  key: string
}

function checkIsSourceMap(name: string) {
  return /\.map$/.test(name)
}

function checkIsSourceCode(name: string) {
  return /\.(css|js)$/.test(name)
}

function validateAndTransformFiles(
  filesUploaded: any[],
  filesInfo: any[],
  moduleInfo: { id: ModuleId; version: string },
): TransformFile[] {
  const { id, version } = moduleInfo

  const filesIsEmpty = !filesUploaded || filesUploaded.length === 0
  if (filesIsEmpty) {
    throw new Error('Files is required to store')
  }

  const totalSize = filesUploaded.reduce((total, item) => total + item.size, 0)
  if (totalSize > TOTAL_FILE_SIZE_LIMIT) {
    throw new Error(
      `Exceeded total files size limit allowed, limit is ${TOTAL_FILE_SIZE_LIMIT}!`,
    )
  }

  const transformedFiles: TransformFile[] = []
  for (const file of filesUploaded) {
    if (
      checkIsSourceMap(file.originalname) &&
      file.size > SOURCE_MAP_FILE_SIZE_LIMIT
    ) {
      throw new Error(
        `File ${file.originalname} is exceeds the allowed size for source map, limit is ${SOURCE_MAP_FILE_SIZE_LIMIT} byte!`,
      )
    } else if (
      checkIsSourceCode(file.originalname) &&
      file.size > SOURCE_CODE_FILE_SIZE_LIMIT
    ) {
      throw new Error(
        `File ${file.originalname} is exceeds the allowed size for code, limit is ${SOURCE_CODE_FILE_SIZE_LIMIT} byte!`,
      )
    } else if (file.size > OTHER_FILE_SIZE_LIMIT) {
      throw new Error(
        `File ${file.originalname} is exceeds the allowed size for other file, limit is ${OTHER_FILE_SIZE_LIMIT} byte!`,
      )
    }

    file.md5sum = hashFile(file.path, 'md5')
    file.assetPath = filesInfo.find((item) => file.md5sum === item.md5sum)?.path
    if (!file.assetPath) {
      throw new Error(
        `File ${file.originalname} is invalid, not match with stats info!`,
      )
    }

    transformedFiles.push({
      fileName: file.filename,
      originalName: file.originalname,
      assetPath: file.assetPath,
      tempPath: file.path,
      mimeType: file.mimetype,
      encoding: file.encoding,
      size: file.size,
      md5sum: file.md5sum,
      key: assetsUrlHelpers.key(id, version, file.assetPath),
    })
  }

  return transformedFiles
}

export default validateAndTransformFiles
