const getPackageJsonTool = () => {
  try {
    return require('../../package.json')
  } catch {
    return null
  }
}

export default getPackageJsonTool
