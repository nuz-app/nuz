import {
  BaseItemConfig,
  BootstrapConfig,
  ExternalItemConfig,
  ExternalsConfig,
  ModuleFormats,
  ModuleItemConfig,
  ModulesConfig,
} from '../types'

const setDefaultIfUnset = <T extends BaseItemConfig>(
  item: T,
  isExternal: boolean,
): T => {
  const cloned = { ...item, isExternal }

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

const checkIsExistedInModules = <T = string>(item: T, list: T[]): boolean =>
  list.includes(item)

const transform = <T>(items, isExternal: boolean): T =>
  (items || []).filter(Boolean).map(item => setDefaultIfUnset(item, isExternal))

class Config {
  private _externals: ExternalsConfig
  private _modules: ModulesConfig
  private _locked: boolean

  constructor({
    externals,
    modules,
  }: Pick<BootstrapConfig, 'externals' | 'modules'>) {
    this._externals = []
    this._modules = []
    this._locked = false

    this.setExternals(externals)
    this.setModules(modules)
    console.log({ modules, xxx: this._modules })
  }

  lock() {
    return (this._locked = true)
  }

  unlock() {
    return (this._locked = false)
  }

  getExternals() {
    return this._externals
  }

  setExternals(externals: ExternalsConfig) {
    if (this._locked) {
      throw new Error('Can not set externals because config was locked!')
    }

    const transformed = transform<ExternalsConfig>(externals, true)
    this._externals.push(...transformed)
  }

  setExternal(external: ExternalItemConfig) {
    return this.setExternals([external])
  }

  getModules() {
    return this._modules
  }

  setModules(modules: ModulesConfig) {
    if (this._locked) {
      throw new Error('Can not set modules because config was locked!')
    }

    const names = this._modules.map(i => i.name)
    const transformed = transform<ModulesConfig>(modules, false).filter(
      item => !checkIsExistedInModules(item.name, names),
    )

    this._modules.push(...transformed)
  }

  setModule(module: ModuleItemConfig) {
    return this.setModules([module])
  }
}

export default Config
