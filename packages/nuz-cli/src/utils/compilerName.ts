import * as paths from '../paths'

export function get(module: string) {
  const packageJsonTool = paths.packageJsonTool() || {}

  return `${packageJsonTool.name}(${module})`
}

export function extract(name: string) {
  return (name || '').replace(/^([\s\S]+)\(([\s\S]+)\)$/i, '$2')
}
