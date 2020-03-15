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

  if (cloned.preferLocal === undefined) {
    cloned.preferLocal = true
  }

  if (!cloned.alias) {
    cloned.alias = {}
  }

  if (!cloned.format) {
    cloned.format = ModuleFormats.umd
  }

  Object.freeze(cloned)

  return cloned
}

class Config {
  private _vendors: VendorsConfig
  private _modules: ModulesConfig
  private _linked: BootstrapConfig['linked']
  private _locked: boolean
  private _dev: boolean

  constructor({
    dev,
    vendors,
    modules,
    linked,
  }: Pick<BootstrapConfig, 'dev' | 'vendors' | 'modules' | 'linked'>) {
    this._vendors = {}
    this._modules = {}
    this._dev = typeof dev === 'boolean' ? dev : !checkIsProduction()
    this._linked = linked
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

  getVendors() {
    return this._vendors
  }

  setVendors(vendors: VendorsConfig) {
    if (this._locked) {
      throw new Error('Can not set vendors because config was locked!')
    }

    Object.assign(this._vendors, vendors)
  }

  getModules() {
    return this._modules
  }

  setModules(modules: ModulesConfig) {
    if (this._locked) {
      throw new Error('Can not set modules because config was locked!')
    }

    const keys = Object.keys(modules)
    const transformed = keys.reduce(
      (acc, key) =>
        Object.assign(acc, {
          [key]: setDefaultIfUnset(key, modules[key]),
        }),
      {},
    )
    Object.assign(this._modules, transformed)
  }
}

export default Config
