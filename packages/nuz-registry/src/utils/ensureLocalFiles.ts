import { Resource, VersionSizes } from '../types'

function ensureLocalFiles(
  localFiles: any[],
  moduleInformation: { resolve: any },
): { files: Resource[]; sizes: VersionSizes } {
  const { resolve } = moduleInformation

  if (!localFiles || localFiles.length === 0) {
    throw new Error('Could not find any files uploaded.')
  }

  //
  const scriptPaths = [resolve.script.path]
  const stylesPaths = (resolve.styles || []).map((item) => item.path)

  //
  const ensuredFiles: Resource[] = []
  const sizes = {
    total: 0,
    script: 0,
    styles: 0,
  }

  //
  for (const file of localFiles) {
    // Ensure file is have full important information.
    if (
      !file.url ||
      !file.integrity ||
      !file.md5sum ||
      !file.path ||
      typeof file.size !== 'number'
    ) {
      throw new Error(`File is missing important information.`)
    }

    // Updated size information.
    sizes.total += file.size
    if (scriptPaths.includes(file.path)) {
      sizes.script += file.size
    } else if (stylesPaths.includes(file.path)) {
      sizes.styles += file.size
    }

    ensuredFiles.push({
      // Important information.
      url: file.url,
      path: file.path,
      size: file.size,
      md5sum: file.md5sum,
      integrity: file.integrity,
    })
  }

  return { files: ensuredFiles, sizes }
}

export default ensureLocalFiles
