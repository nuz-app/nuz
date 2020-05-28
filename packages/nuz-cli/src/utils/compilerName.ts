import * as paths from './paths'

export const get = (module: string) => {
  const packageJsonTool = paths.getPackageJsonTool() || {}

  return `${packageJsonTool.name}(${module})`
}

export const extract = (name: string) =>
  name.toString().replace(/^([\s\S]+)\(([\s\S]+)\)$/i, '$2')
