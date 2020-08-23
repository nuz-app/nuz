import { BaseModuleConfiguration } from '../types'

export interface DefineExportsConfiguration {
  module?: boolean
  upstream?: boolean
  local?: boolean
  fallback?: boolean
  vendor?: boolean
  linked?: boolean
  shared?: boolean
  id?: string
}

const EXPORTS_MODULE_DEFINED = {
  module: '__esModule',
  linked: '__linked',
  local: '__local',
  vendor: '__vendor',
  upstream: '__upstream',
  fallback: '__fallback',
  shared: '__shared',
} as { [name: string]: any }

export function define<M extends unknown>(
  module: M,
  configuration: DefineExportsConfiguration,
): M {
  // tslint:disable-next-line: forin
  for (const key in configuration) {
    const defined = EXPORTS_MODULE_DEFINED[key]
    const value = (configuration as any)[key]
    if (value && defined) {
      Object.defineProperty(module, defined, { value: true })
    } else if (value) {
      Object.defineProperty(module, `__${key}`, { value })
    }
  }

  return module
}

export function transform<T extends unknown>(
  module: any,
  configuration?: Pick<BaseModuleConfiguration, 'exportsOnly' | 'alias'>,
): T {
  const { alias = {}, exportsOnly } = configuration || {}

  function checkIsExport(n: string): boolean {
    return !exportsOnly || exportsOnly.includes(n)
  }

  // tslint:disable-next-line: forin
  for (const name in module) {
    const changed = alias[name]
    if (changed) {
      if (checkIsExport(changed)) {
        module[changed] = module[name]
      }

      if (checkIsExport(name)) {
        module[name] = module[name]
      }
    }

    if (!changed && checkIsExport(name)) {
      module[name] = module[name]
    }
  }

  return module
}
