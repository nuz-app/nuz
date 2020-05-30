import { 
  MODULE_OTHER_SIZE_LIMIT, 
  MODULE_TOTAL_SIZE_LIMIT,
  MODULE_ASSET_SIZE_LIMIT,
} from '@nuz/shared'
import { assetsUrlHelpers, hashFile } from '@nuz/utils'

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
  if (totalSize > MODULE_TOTAL_SIZE_LIMIT) {
    throw new Error(
      `Exceeded total files size limit allowed, limit is ${MODULE_TOTAL_SIZE_LIMIT}!`,
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
      file.size > MODULE_OTHER_SIZE_LIMIT
    ) {
      throw new Error(
        `File ${file.originalname} is exceeds the allowed size ${MODULE_OTHER_SIZE_LIMIT} byte for source map!`,
      )
    } else if (
      checkIsSourceCode(file.originalname) &&
      file.size > MODULE_ASSET_SIZE_LIMIT
    ) {
      throw new Error(
        `File ${file.originalname} is exceeds the allowed size ${MODULE_ASSET_SIZE_LIMIT} byte for asset file!`,
      )
    } else if (file.size > MODULE_OTHER_SIZE_LIMIT) {
      throw new Error(
        `File ${file.originalname} is exceeds the allowed size ${MODULE_OTHER_SIZE_LIMIT} byte for other file!`,
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
