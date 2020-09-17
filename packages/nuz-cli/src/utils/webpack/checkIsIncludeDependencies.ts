const excludeModulesRegexp = /^(react|react-dom)/i

/**
 * Should be include file(s) to bundle?
 * return `true` will be include it
 */
export function checkIsIncludeDependencies(file: string): boolean {
  // Don't need to rebuild exclude dependencies
  // And `react` and `react-dom` in the projects
  // https://reactjs.org/docs/react-dom.html#browser-support
  if (excludeModulesRegexp.test(file)) {
    return false
  }

  return true
}

export default checkIsIncludeDependencies
