import { checkIsObject } from '@nuz/utils'

import {
  BaseItemConfig,
  BootstrapConfig,
  ModuleFormats,
  ModulesConfig,
  SharedConfig,
  VendorsConfig,
} from '../types'

import checkIsProduction from '../utils/checkIsProduction'

const setDefaultIfUnset = <T extends BaseItemConfig>(
  name: string,
  item: T,
): T => {
  const isObject = checkIsObject(item)
  const isInvalid = !(isObject && item.library)
  if (isInvalid) {
    throw new Error(`Module ${name} is invalid config`)
  }

  const cloned = { ...item, name }

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

  return cloned
}

export type ConfigInitial = Pick<
  BootstrapConfig,
  'ssr' | 'shared' | 'preload' | 'dev' | 'vendors' | 'modules' | 'linked'
>

class Config {
  private _vendors: VendorsConfig
  private _modules: ModulesConfig
  private _shared: SharedConfig
  private _linked: BootstrapConfig['linked']
  private _preload: BootstrapConfig['preload']
  private _locked: boolean
  private _dev: boolean
  private _ssr: boolean

  constructor({
    dev,
    ssr,
    preload,
    vendors,
    modules,
    shared,
    linked,
  }: ConfigInitial) {
    this._dev = typeof dev === 'boolean' ? dev : !checkIsProduction()

    this._vendors = {}
    this._modules = {}
    this._shared = {}
    this._linked = linked
    this._ssr = typeof ssr === 'boolean' ? ssr : false
    this._preload = preload || []
    this._locked = false

    this.setVendors(vendors || {})
    this.setModules(modules || {})
    this.setShared(shared || {})
  }

  raw(): ConfigInitial {
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
    if (this._locked) {
      throw new Error('Can not set shared because config was locked!')
    }

    this._vendors = {}
    this._modules = {}
    this._shared = {}
    this._preload = preload || []

    this.setVendors(vendors || {})
    this.setModules(modules || {})
    this.setShared(shared || {})
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

  isSSR() {
    return this._ssr
  }

  getLinked() {
    return this._linked || {}
  }

  getPreload() {
    return this._preload || []
  }

  getShared() {
    return this._shared || {}
  }

  setShared(shared: SharedConfig): SharedConfig {
    if (this._locked) {
      throw new Error('Can not set shared because config was locked!')
    }

    return Object.assign(this._shared, shared)
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
    const keys = Object.keys(modules || {})
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
