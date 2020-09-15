import { getPackageJsonInDirectory } from '@nuz/utils'

function checkIsPackageUsed(name: string, directory: string): boolean {
  const packageJson = getPackageJsonInDirectory(directory)

  const allDependencies = Object.assign(
    {},
    packageJson.dependencies,
    packageJson.devDependencies,
    packageJson.peerDependencies,
  )
  const keys = Object.keys(allDependencies)

  return keys.includes(name)
}

export default checkIsPackageUsed
