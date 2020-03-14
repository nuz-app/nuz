import getPackageJsonTool from './getPackageJsonTool'

export const get = (module: string) => {
  const packageJsonTool = getPackageJsonTool() || {}

  return `${packageJsonTool.name}(${module})`
}

export const extract = (name: string) =>
  name.toString().replace(/^([\s\S]+)\(([\s\S]+)\)$/i, '$2')
