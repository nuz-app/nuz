import { getPackageJsonInDirectory } from '@nuz/utils'

const checkIsInstalledPackage = (name: string, dir: string): boolean => {
  const pkgJson = getPackageJsonInDirectory(dir)

  const allDependencies = Object.assign(
    {},
    pkgJson.dependencies,
    pkgJson.devDependencies,
    pkgJson.peerDependencies,
  )

  const keys = Object.keys(allDependencies)
  return keys.includes(name)
}

export default checkIsInstalledPackage
