import { assetsUrlHelpers, hashFile } from '@nuz/utils'

import {
  OTHER_FILE_SIZE_LIMIT,
  SOURCE_CODE_FILE_SIZE_LIMIT,
  SOURCE_MAP_FILE_SIZE_LIMIT,
  TOTAL_FILE_SIZE_LIMIT,
} from '../lib/const'
import { ModuleId, Resource, VersionSizes } from '../types'

export interface TransformFile extends Resource {
  fileName: string
  originalName: string
  tempPath: string
  mimeType: string
  encoding: string
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
  moduleInfo: { id: ModuleId; version: string; resolve: any },
): { files: TransformFile[]; sizes: VersionSizes } {
  const { id, version, resolve } = moduleInfo

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

  const mainPaths = resolve.main.path
  const stylesPaths = (resolve.styles || []).map((item) => item.path)

  const files: TransformFile[] = []
  const sizes = {
    total: 0,
    main: 0,
    styles: 0,
  }

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

    file.md5sum = hashFile(file.tempPath, 'md5')
    file.path = filesInfo.find((item) => file.md5sum === item.md5sum)?.path
    if (!file.path) {
      throw new Error(
        `File ${file.originalname} is invalid, not match with stats info!`,
      )
    }

    if (mainPaths.includes(file.path)) {
      sizes.main += file.size
    } else if (stylesPaths.includes(file.path)) {
      sizes.styles += file.size
    }

    sizes.total += file.size

    files.push({
      // NOTE: `url` will be added after upload to storage
      url: null as any,
      path: file.path,
      size: file.size,
      md5sum: file.md5sum,

      fileName: file.filename,
      originalName: file.originalname,
      tempPath: file.tempPath,
      mimeType: file.mimetype,
      encoding: file.encoding,
      key: assetsUrlHelpers.key(id, version, file.path),
    })
  }

  return { files, sizes }
}

export default validateAndTransformFiles
