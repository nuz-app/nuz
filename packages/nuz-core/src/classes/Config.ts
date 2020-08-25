import { ModuleFormats } from '@nuz/shared'
import {
  checkIsObject,
  checkIsProductionMode,
  moduleIdHelpers,
} from '@nuz/utils'

import {
  BaseModuleConfiguration,
  BootstrapConfiguration,
  ModulesConfig,
  RequiredModuleConfiguration,
} from '../types'

export type ConfigInitial = Pick<
  BootstrapConfiguration,
  | 'ssr'
  | 'shared'
  | 'preload'
  | 'dev'
  | 'vendors'
  | 'modules'
  | 'linked'
  | 'registry'
  | 'global'
  | 'context'
>

export type ConfigUpdate = Pick<
  ConfigInitial,
  'preload' | 'vendors' | 'modules' | 'shared'
>

class Config {
  private readonly config: NonNullable<ConfigInitial>

  /**
   * Check the lock status of the configuration,
   * when the lock is not updated.
   */
  private locked: boolean

  constructor(configuration: ConfigInitial) {
    const { dev } = configuration

    this.locked = false
    this.config = Object.assign(
      {
        preload: [],
        linked: {},
        vendors: {},
        shared: {},
        modules: {},
      },
      configuration,
      {
        dev: typeof dev === 'boolean' ? dev : !checkIsProductionMode(),
      },
    )
  }

  export(): Pick<ConfigInitial, 'preload' | 'modules'> {
    return {
      preload: this.config.preload,
      modules: this.config.modules,
    }
  }

  update(update: Required<ConfigUpdate>): void {
    this.verify()

    const { preload, vendors, modules, shared } = update

    this.config.vendors = vendors || {}
    this.config.shared = shared || {}
    this.config.preload = preload || []
    this.config.modules = Config.transforms(modules)
  }

  lock(): boolean {
    return (this.locked = true)
  }

  unlock(): boolean {
    return (this.locked = false)
  }

  get<T = any>(field: string): T {
    return (this.config as any)[field]
  }

  verify(): void {
    if (this.locked) {
      throw new Error('Cannot be updated because the configuration is locked')
    }
  }

  static ensure(
    idOrName: string,
    configuration: BaseModuleConfiguration,
  ): RequiredModuleConfiguration {
    if (!configuration || !checkIsObject(configuration)) {
      throw new Error(`Module configuration is invalid`)
    }

    const moduleId = moduleIdHelpers.use(idOrName)
    const updated = Object.assign(
      { alias: {}, shared: [], format: ModuleFormats.umd },
      configuration,
      {
        id: moduleId,
      },
    )

    const shouldBeUpdatedId = !!(updated.name && updated.version)
    if (shouldBeUpdatedId) {
      updated.id = moduleIdHelpers.create(
        updated.name as string,
        updated.version,
      )
    }

    const shouldBeUpdateNameAndVersion = !shouldBeUpdatedId && !updated.name
    if (shouldBeUpdateNameAndVersion) {
      const parsed = moduleIdHelpers.parser(updated.id)
      updated.name = parsed.module
      updated.version = parsed.version
    }

    Object.freeze(updated)

    return updated as RequiredModuleConfiguration
  }

  static transforms(modules: ModulesConfig): ModulesConfig {
    const keys = Object.keys(modules || {})
    const updated = keys.reduce((acc, id) => {
      const item = Config.ensure(id, modules[id])
      return Object.assign(acc, {
        [item.id]: item,
      })
    }, {})

    return updated
  }
}

export default Config
