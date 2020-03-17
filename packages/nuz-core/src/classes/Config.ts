import {
  BaseItemConfig,
  BootstrapConfig,
  ModuleFormats,
  ModulesConfig,
  VendorsConfig,
} from '../types'

import checkIsProduction from '../utils/checkIsProduction'

const setDefaultIfUnset = <T extends BaseItemConfig>(
  name: string,
  item: T,
): T => {
  const cloned = { ...item, name }

  if (!cloned.alias) {
    cloned.alias = {}
  }

  if (!cloned.format) {
    cloned.format = ModuleFormats.umd
  }

  Object.freeze(cloned)

  return cloned
}

export type ConfigInitial = Pick<
  BootstrapConfig,
  'preload' | 'dev' | 'vendors' | 'modules' | 'linked'
>

class Config {
  private _vendors: VendorsConfig
  private _modules: ModulesConfig
  private _linked: BootstrapConfig['linked']
  private _preload: BootstrapConfig['preload']
  private _locked: boolean
  private _dev: boolean

  constructor({ dev, preload, vendors, modules, linked }: ConfigInitial) {
    this._dev = typeof dev === 'boolean' ? dev : !checkIsProduction()

    this._vendors = {}
    this._modules = {}
    this._linked = linked
    this._preload = preload || []
    this._locked = false

    this.setVendors(vendors)
    this.setModules(modules)
  }

  lock() {
    return (this._locked = true)
  }

  unlock() {
    return (this._locked = false)
  }

  isDev() {
    return this._dev
  }

  getLinked() {
    return this._linked
  }

  getPreload() {
    return this._preload
  }

  getVendors() {
    return this._vendors
  }

  setVendors(vendors: VendorsConfig): VendorsConfig {
    if (this._locked) {
      throw new Error('Can not set vendors because config was locked!')
    }

    return Object.assign(this._vendors, vendors)
  }

  getModules() {
    return this._modules
  }

  setModules(modules: ModulesConfig): ModulesConfig {
    if (this._locked) {
      throw new Error('Can not set modules because config was locked!')
    }

    const transformed = this.defineModules(modules)
    return Object.assign(this._modules, transformed)
  }

  defineModules(modules: ModulesConfig): ModulesConfig {
    const keys = Object.keys(modules)
    const transformed = keys.reduce(
      (acc, key) =>
        Object.assign(acc, {
          [key]: setDefaultIfUnset(key, modules[key]),
        }),
      {},
    )

    return transformed
  }
}

export default Config
