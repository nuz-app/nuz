import { checkIsObject } from '@nuz/utils'

import {
  BaseItemConfig,
  ExternalItemConfig,
  InstallConfig,
  ModuleItemConfig,
  RuntimePlatforms,
} from '../types'

import checkIsFunction from '../utils/checkIsFunction'
import checkIsInitialized from '../utils/checkIsInitialized'
import * as DOMHelpers from '../utils/DOMHelpers'
import getConfig, { Config } from '../utils/effects/getConfig'
import getRuntimePlatform from '../utils/getRuntimePlatform'
import getScript from '../utils/getScript'
import * as hasher from '../utils/hasher'
import interopRequireDefault from '../utils/interopRequireDefault'
import * as jsonHelpers from '../utils/jsonHelpers'
import * as moduleHelpers from '../utils/moduleHelpers'
import * as requireHelpers from '../utils/requireHelpers'

import Caches from './Caches'
import Globals from './Globals'
import Script from './Script'

const ensureInstallConfig = ({ timeout, retries }: InstallConfig = {}) => ({
  timeout: timeout || 60000,
  retries: retries || 1,
})

const pickIfSet = (upstream, config) => {
  const isObject = checkIsObject(upstream)
  if (!isObject) {
    return config
  }

  const { library, alias, format, exportsOnly } = config

  return {
    library: upstream.library || library,
    alias: upstream.alias || alias,
    format: upstream.format || format,
    exportsOnly: upstream.exportsOnly || exportsOnly,
  }
}

export interface LoadResults<M = unknown> {
  module: M
  styles: Element[]
}

class Modules {
  private readonly _config: Config
  private readonly _platform: RuntimePlatforms
  private readonly _globals: Globals
  private readonly _resolvedExternals: Caches<string, LoadResults<any>>
  private readonly _resolvedModules: Caches<string, LoadResults<any>>
  private readonly _pingResources: Caches<
    string,
    { script: Element; styles: Element[] }
  >

  constructor() {
    if (!checkIsInitialized()) {
      throw new Error('Modules was not call bootstrap before used')
    }

    this._config = getConfig()
    this._platform = getRuntimePlatform()
    this._globals = new Globals(this._platform)

    // Init resolved caches for externals and modules
    this._resolvedExternals = new Caches()
    this._resolvedModules = new Caches()
    this._pingResources = new Caches()
  }

  private getKey(item: BaseItemConfig) {
    return item.isExternal
      ? 'e:' + hasher.moduleId(item)
      : 'm:' + (item as ModuleItemConfig).name
  }

  private canUseLocal(item: BaseItemConfig) {
    const { name, local, preferLocal } = item

    if (!preferLocal) {
      return false
    }

    return !!(local || requireHelpers.local(name, this._globals))
  }

  private findItemByName(
    name: string,
    includes = {} as { modules: boolean; externals: boolean },
  ) {
    const externals = !includes.externals ? [] : this._config.getExternals()
    const modules = !includes.modules ? [] : this._config.getModules()
    const all = [...externals, ...modules]

    const result = all.find(item => item.name === name)
    return result
  }

  private createContext() {
    return Object.create(this._globals.get())
  }

  private ping(item: BaseItemConfig) {
    const isNode = this._platform === RuntimePlatforms.node
    if (isNode) {
      return false
    }

    const canUseLocal = this.canUseLocal(item)
    if (canUseLocal) {
      return false
    }

    const key = this.getKey(item)
    const called =
      this._pingResources.has(key) ||
      this._resolvedExternals.has(key) ||
      this._resolvedModules.has(key)
    if (called) {
      return true
    }

    const { isExternal, upstream } = item
    const resolveUrls = requireHelpers.parse(upstream, this._platform)
    console.log({ item, upstream })

    const preloadScript = DOMHelpers.preloadScript(resolveUrls.main.url, {
      ...resolveUrls.main,
      isExternal,
    })
    const preloadStyles = resolveUrls.styles.map(style =>
      DOMHelpers.preloadStyle(style.url, {
        ...style,
        isExternal,
      }),
    )

    this._pingResources.set(key, {
      script: preloadScript,
      styles: preloadStyles,
    })

    return true
  }

  private async resolveOnUpstream(
    item: BaseItemConfig,
    options?: InstallConfig,
  ) {
    const isNode = this._platform === RuntimePlatforms.node

    const { upstream } = item
    const { library, format, alias, exportsOnly } = pickIfSet(upstream, item)
    const { timeout, retries } = ensureInstallConfig(options)

    const { main, styles } = requireHelpers.parse(upstream, this._platform)

    const moduleScript = await getScript(
      main.url,
      {
        timeout,
        integrity: main.integrity,
      },
      retries,
    )

    const context = this.createContext()

    try {
      const script = new Script(moduleScript, {
        format,
      })

      if (isNode) {
        await script.runInContext(context)
      } else {
        await script.runInScript(context)
      }
    } catch (error) {
      console.error(
        `Module installed uncaught error: ${error.message || error}`,
      )
      throw error
    }

    const moduleInContext = library ? context[library] : context
    let exportsModule = Object.assign(
      {},
      interopRequireDefault(moduleInContext),
      moduleInContext,
    )
    exportsModule = moduleHelpers.transform(exportsModule, {
      alias,
      exportsOnly,
    })
    exportsModule = moduleHelpers.define(exportsModule, {
      module: true,
      upstream: true,
    })

    if (!checkIsFunction(exportsModule.default)) {
      throw new Error('Module is not exported!')
    }

    const moduleStyles = styles.map(style =>
      DOMHelpers.loadStyle(style.url, { integrity: style.integrity }),
    )

    return {
      module: exportsModule,
      styles: moduleStyles,
    }
  }

  private async resolveInLocal(item: BaseItemConfig, options?: InstallConfig) {
    const { name, local, preferLocal } = item

    if (preferLocal) {
      const resolvedInLocal = local || requireHelpers.local(name, this._globals)
      if (resolvedInLocal) {
        const localModule = moduleHelpers.define(resolvedInLocal, {
          module: true,
          local: true,
        })

        return {
          module: localModule,
          styles: [],
        }
      }
    }

    return null
  }

  private async resolve(item: BaseItemConfig, options?: InstallConfig) {
    const resolveInLocal = await this.resolveInLocal(item, options)
    if (resolveInLocal) {
      return resolveInLocal
    }

    try {
      const resolvedOnUpstream = await this.resolveOnUpstream(item, options)
      return resolvedOnUpstream
    } catch (error) {
      console.error(
        `Cannot load or execute module on upstream: ${error.message || error}`,
      )

      const fallbackIsExisted = !!item.fallback
      if (!fallbackIsExisted) {
        throw error
      }

      const cloned = { ...item, upstream: item.fallback, fallback: undefined }
      console.log(
        `Try to use fallback as backup module: ${jsonHelpers.stringify(
          cloned,
        )}`,
      )

      const resolvedOfFallback = await this.resolveOnUpstream(cloned, options)
      return resolvedOfFallback
    }
  }

  private async load<M = unknown>(
    item: BaseItemConfig,
    options?: InstallConfig,
  ): Promise<LoadResults<M>> {
    const { isExternal } = item

    const resolvedCaches = isExternal
      ? this._resolvedExternals
      : this._resolvedModules

    const key = this.getKey(item)
    if (resolvedCaches.has(key)) {
      return resolvedCaches.get(key)
    }

    const resolvedModule = await this.resolve(item, options)

    if (isExternal) {
      const exportedKeys = Object.keys(resolvedModule.module)
      exportedKeys.forEach((field: string) => {
        this._globals.set(field, resolvedModule.module[field])
      })
    }

    resolvedCaches.set(key, resolvedModule)
    return resolvedModule
  }

  async prepare() {
    await this.loadExternals()
  }

  async preload(names: string[]) {
    const externals = this._config.getExternals()
    const modules = this._config.getModules()
    const all = [...externals, ...modules]
    const matches = all.filter(item => names.includes(item.name))

    return matches.map(match => this.ping(match))
  }

  async loadExternals() {
    const externals = this._config.getExternals()

    externals.map(item => this.ping(item))
    const promises = Promise.all(
      externals.map(item => this.load(item, item.options)),
    )
    return await promises
  }

  async requireByName<T = unknown>(name: string): Promise<T> {
    console.log({ name })
    const resolved = await this.loadByName<T>(name)
    return resolved.module
  }

  async loadByName<M = unknown>(name: string): Promise<LoadResults<M>> {
    const item = this.findItemByName(name, { externals: true, modules: true })
    if (!item) {
      throw new Error(`Cannot load module by name: ${name}.`)
    }

    const resolved = await this.load<M>(item)
    return resolved
  }
}

export default Modules
