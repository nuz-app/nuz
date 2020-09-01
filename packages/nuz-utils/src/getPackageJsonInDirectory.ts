function getPackageJsonInDirectory<T = any>(directory: string): T | null {
  try {
    return require(directory + '/package.json')
    // tslint:disable-next-line: no-empty
  } catch {}

  return null
}

export default getPackageJsonInDirectory
