import * as paths from './paths'

const checkIsPackageInstalled = (name: string) => {
  try {
    return paths.resolveInApp(name)
  } catch (errror) {
    return false
  }
}

export default checkIsPackageInstalled
