import { BaseItemConfig } from '../types'

export interface ExportedConfig {
  module?: boolean
  upstream?: boolean
  local?: boolean
  fallback?: boolean
  vendor?: boolean
  linked?: boolean
  shared?: boolean
}

const definedKeys = {
  module: '__esModule',
  linked: '__isLinked',
  local: '__isLocal',
  vendor: '__isVendor',
  upstream: '__isUpstream',
  fallback: '__isFallback',
  shared: '__isShared',
} as { [name: string]: any }

export const define = (module: any, config: ExportedConfig) => {
  // tslint:disable-next-line: forin
  for (const key in config) {
    const defined = definedKeys[key]
    if ((config as any)[key] && defined) {
      Object.defineProperty(module, defined, { value: true })
    }
  }

  return module
}

export const transform = (
  exportsModule: any,
  config?: Pick<BaseItemConfig, 'exportsOnly' | 'alias'>,
) => {
  const { alias = {}, exportsOnly } = config || ({} as any)

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
