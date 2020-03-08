const getPackageJsonInDir = (dir: string) => {
  try {
    return require(dir + '/package.json')
  } catch {
    return null
  }
}

export default getPackageJsonInDir
