import { ModuleFormats } from '@nuz/shared'
import {
  checkIsObject,
  checkIsProductionMode,
  moduleIdHelpers,
} from '@nuz/utils'

import {
  BaseItemConfig,
  BootstrapConfig,
  ModulesConfig,
  SharedConfig,
  VendorsConfig,
} from '../types'

const setDefaultIfUnset = <T extends BaseItemConfig>(
  idOrName: string,
  item: T,
): Required<T> => {
  const isObject = checkIsObject(item)
  const isInvalid = !isObject
  if (isInvalid) {
    throw new Error(`Module ${idOrName} is invalid config`)
  }

  const id = moduleIdHelpers.use(idOrName)
  const cloned = { ...item, id }

  if (cloned.name && cloned.version) {
    cloned.id = moduleIdHelpers.create(cloned.name, cloned.version)
  } else if (!cloned.name) {
    const parsedId = moduleIdHelpers.parser(cloned.id)
    cloned.name = parsedId.module
    cloned.version = parsedId.version
  }

  if (!cloned.alias) {
    cloned.alias = {}
  }

  if (!cloned.shared) {
    cloned.shared = []
  }

  if (!cloned.format) {
    cloned.format = ModuleFormats.umd
  }

  Object.freeze(cloned)

  return cloned as Required<T>
}

export type ConfigInitial = Pick<
  BootstrapConfig,
  | 'ssr'
  | 'shared'
  | 'preload'
  | 'dev'
  | 'vendors'
  | 'modules'
  | 'linked'
  | 'registry'
  | 'global'
>

class Config {
  // @ts-ignore
  private _registry: string
  // @ts-ignore
  private _global: boolean
  private _vendors: VendorsConfig
  private _modules: ModulesConfig
  private _shared: SharedConfig
  // @ts-ignore
  private _linked: BootstrapConfig['linked']
  private _preload: BootstrapConfig['preload']
  private _locked: boolean
  // @ts-ignore
  private _dev: boolean
  // @ts-ignore
  private _ssr: boolean

  constructor({
    registry,
    global,
    dev,
    ssr,
    preload,
    vendors,
    modules,
    shared,
    linked,
  }: ConfigInitial) {
    this._dev = typeof dev === 'boolean' ? dev : !checkIsProductionMode()
    this._global = global as boolean
    this._registry = registry as string
    this._vendors = {}
    this._modules = {}
    this._shared = {}
    this._linked = Object.assign({}, linked)
    this._ssr = ssr as boolean
    this._preload = preload || []
    this._locked = false

    this.assignVendors(vendors || {})
    this.assignModules(modules || {})
    this.assignShared(shared || {})
  }

  export(): ConfigInitial {
    return {
      preload: this._preload,
      modules: this._modules,
    }
  }

  update({
    preload,
    vendors,
    modules,
    shared,
  }: Pick<ConfigInitial, 'preload' | 'vendors' | 'modules' | 'shared'>) {
    this.ensureUnlock('any')

    this._vendors = {}
    this._modules = {}
    this._shared = {}
    this._preload = preload || []

    this.assignVendors(vendors || {})
    this.assignModules(modules || {})
    this.assignShared(shared || {})
  }

  lock() {
    return (this._locked = true)
  }

  unlock() {
    return (this._locked = false)
  }

  get<T = unknown>(field: string): T {
    return this[`_${field}`] as T
  }

  ensureUnlock(field: string) {
    if (this._locked) {
      throw new Error(`Can't assign or set ${field} because config was locked`)
    }
  }

  assignShared(shared: SharedConfig): SharedConfig {
    this.ensureUnlock('shared')

    return Object.assign(this._shared, shared)
  }

  assignVendors(vendors: VendorsConfig): VendorsConfig {
    this.ensureUnlock('vendors')

    return Object.assign(this._vendors, vendors)
  }

  assignModules(modules: ModulesConfig): ModulesConfig {
    this.ensureUnlock('modules')

    const transformed = this.defineModules(modules)
    return Object.assign(this._modules, transformed)
  }

  defineModules(modules: ModulesConfig): ModulesConfig {
    const ids = Object.keys(modules || {})
    const transformed = ids.reduce((acc, id) => {
      const moduleEnsured = setDefaultIfUnset(id, modules[id])
      return Object.assign(acc, {
        [moduleEnsured.id]: moduleEnsured,
      })
    }, {})

    return transformed
  }
}

export default Config
