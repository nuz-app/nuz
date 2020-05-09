import { assetsUrlHelpers, hashFile } from '@nuz/utils'

import { FILE_LENGTH_LIMIT, FILE_SIZE_LIMIT } from '../lib/const'
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

  if (filesUploaded.length > FILE_LENGTH_LIMIT) {
    throw new Error(
      `Exceeded the allowed file number of a version, limit is ${FILE_LENGTH_LIMIT}!`,
    )
  }

  const transformedFiles: TransformFile[] = []
  for (const file of filesUploaded) {
    if (file.size > FILE_SIZE_LIMIT) {
      throw new Error(
        `File ${file.originalname} is exceeds the allowed size, limit is ${FILE_SIZE_LIMIT} byte!`,
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
