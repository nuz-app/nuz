import {
  MODULE_ASSET_SIZE_LIMIT,
  MODULE_OTHER_SIZE_LIMIT,
  MODULE_TOTAL_SIZE_LIMIT,
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

function checkIsSourceMap(name: string): boolean {
  return /\.map$/.test(name)
}

function checkIsSourceCode(name: string): boolean {
  return /\.(css|js)$/.test(name)
}

function throwsIfExceedSize(file: any): void {
  if (
    checkIsSourceMap(file.originalname) &&
    file.size > MODULE_OTHER_SIZE_LIMIT
  ) {
    throw new Error(
      `File ${file.originalname} is exceeds the allowed size ${MODULE_OTHER_SIZE_LIMIT} byte for source map!`,
    )
  }
  if (
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
}

function ensureUploadedFiles(
  uploadedFiles: any[],
  localFiles: any[],
  moduleInformation: { id: ModuleId; version: string; resolve: any },
): { files: TransformFile[]; sizes: VersionSizes } {
  const { id, version, resolve } = moduleInformation

  if (!localFiles || localFiles.length === 0) {
    throw new Error('Could not find any files information.')
  }

  if (!uploadedFiles || uploadedFiles.length === 0) {
    throw new Error('Could not find any files uploaded.')
  }

  const totalUploadedSize = uploadedFiles.reduce(
    (total, item) => total + item.size,
    0,
  )
  if (totalUploadedSize > MODULE_TOTAL_SIZE_LIMIT) {
    throw new Error(
      `Exceeded total files size limit allowed, limit is ${MODULE_TOTAL_SIZE_LIMIT}.`,
    )
  }

  //
  const scriptPaths = [resolve.script.path]
  const stylesPaths = (resolve.styles || []).map((item) => item.path)

  //
  const ensuredFiles: TransformFile[] = []
  const sizes = {
    total: 0,
    script: 0,
    styles: 0,
  }

  //
  for (const file of uploadedFiles) {
    throwsIfExceedSize(file)

    const md5sum = hashFile(file.tempPath, 'md5')
    const information = localFiles.find((item) => md5sum === item.md5sum)

    // Updated file information.
    file.md5sum = md5sum
    file.path = information?.path

    // If the path is not found,
    // it's probably something wrong.
    if (!file.path) {
      throw new Error(
        `File ${file.originalname} is invalid, not match with stats info.`,
      )
    }

    // Updated size information.
    sizes.total += file.size
    if (scriptPaths.includes(file.path)) {
      sizes.script += file.size
    } else if (stylesPaths.includes(file.path)) {
      sizes.styles += file.size
    }

    ensuredFiles.push({
      // Important information
      // some fields (md5sum, integrity)
      // may be null but it will be ensured later.
      url: file.url,
      path: file.path,
      size: file.size,
      md5sum: file.md5sum,
      integrity: file.integrity,

      // Some more information for
      // identifying files during CDNs upload or binary comparison.
      fileName: file.filename,
      originalName: file.originalname,
      tempPath: file.tempPath,
      mimeType: file.mimetype,
      encoding: file.encoding,
      key: assetsUrlHelpers.key(id, version, file.path),
    })
  }

  return { files: ensuredFiles, sizes }
}

export default ensureUploadedFiles
