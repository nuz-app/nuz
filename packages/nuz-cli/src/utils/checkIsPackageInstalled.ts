import * as paths from './paths'

const checkIsPackageInstalled = (name: string, dir: string) => {
  try {
    return paths.resolveInApp(name, dir)
  } catch (errror) {
    return false
  }
}

export default checkIsPackageInstalled
