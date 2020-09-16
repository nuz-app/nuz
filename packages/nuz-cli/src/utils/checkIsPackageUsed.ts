import readPackageJson from './readPackageJson'

function checkIsPackageUsed(id: string, directory: string): boolean {
  const packageJson = readPackageJson(directory)
  const allDependencies = Object.assign(
    {},
    packageJson.dependencies,
    packageJson.devDependencies,
    packageJson.peerDependencies,
  )
  const keys = Object.keys(allDependencies)

  return keys.includes(id)
}

export default checkIsPackageUsed
