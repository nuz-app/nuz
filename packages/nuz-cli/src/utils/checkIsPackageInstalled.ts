const checkIsPackageInstalled = (name: string) => {
  try {
    require(name)
    return true
  } catch {
    return false
  }
}

export default checkIsPackageInstalled
