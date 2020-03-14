import { BaseItemConfig } from '../types'

export interface ExportedConfig {
  module?: boolean
  upstream?: boolean
  local?: boolean
  fallback?: boolean
  vendor?: boolean
  linked?: boolean
}

const definedKeys = {
  module: '__esModule',
  linkde: '__isLinked',
  local: '__isLocal',
  vendor: '__isVendor',
  upstream: '__isUpstream',
  fallback: '__isFallback',
}

export const define = (module, config?: ExportedConfig) => {
  const keysOfConfig = Object.keys(config)
  keysOfConfig.forEach(key => {
    const defined = definedKeys[key]
    if (defined) {
      Object.defineProperty(module, defined, { value: true })
    }
  })

  return module
}

export const transform = (
  exportsModule,
  config?: Pick<BaseItemConfig, 'exportsOnly' | 'alias'>,
) => {
  const { alias = {}, exportsOnly } = config

  const checkIsExport = (n: string) => !exportsOnly || exportsOnly.includes(n)

  // tslint:disable-next-line: forin
  for (const name in exportsModule) {
    const changed = alias[name]
    if (changed) {
      if (checkIsExport(changed)) {
        exportsModule[changed] = exportsModule[name]
      }
      if (checkIsExport(name)) {
        exportsModule[name] = exportsModule[name]
      }
    } else if (checkIsExport(name)) {
      exportsModule[name] = exportsModule[name]
    }
  }

  return exportsModule
}
