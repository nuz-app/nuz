import { moduleIdHelpers } from '@nuz/utils'

import { ComposeId, ModuleId } from '../types'

import Cache, {
  SetComposeCacheFactoryFn,
  SetModuleCacheFactoryFn,
} from './Cache'

const CONFIG = {
  COMPOSITION_TIMEOUT: 12 * 60 * 60 * 1000,
  MODULE_TIMEOUT: 6 * 60 * 60 * 1000,
}

type Timer = { [id: string]: NodeJS.Timeout }

class LocalCache implements Cache {
  private readonly data: {
    refs: Map<string, Set<string>>
    composes: Map<string, any>
    modules: Map<string, any>
  }

  private readonly timers: {
    composes: Timer
    modules: Timer
  }

  constructor() {
    const composes = new Map<string, any>()
    const modules = new Map<string, any>()
    const refs = new Map<string, Set<string>>()

    this.data = {
      composes,
      modules,
      refs,
    }

    this.timers = {
      composes: {},
      modules: {},
    }
  }

  // tslint:disable-next-line: no-empty
  public async prepare() {}

  public async clearAllRefsToModule(moduleId: ModuleId) {
    const composeIds = Array.from((await this.getModuleRefs(moduleId)) || [])
    for (const composeId of composeIds) {
      this.deleteCompose(composeId)
    }

    this.deleteModule(moduleId)
    this.deleteModuleRefs(moduleId)
  }

  public async lookupCompose(composeId: ComposeId) {
    const composeData = await this.getCompose(composeId)
    if (composeData) {
      return { data: composeData, factory: undefined }
    }

    // Factory auto cache handler
    const factory: SetComposeCacheFactoryFn = async (
      data: any,
      deps: ModuleId[],
      timeout: number = CONFIG.COMPOSITION_TIMEOUT,
    ) => {
      this.setCompose(composeId, data)

      // Actively delete cache when it expires
      this.setTimeout(
        this.timers.composes,
        composeId,
        () => {
          this.deleteCompose(composeId)

          // Remove refs to dependencies
          for (const moduleId of deps) {
            this.removeModuleRefs(moduleId, [composeId])
          }
        },
        timeout,
      )

      // Add refs to dependencies
      for (const moduleId of deps) {
        this.addModuleRefs(moduleId, [composeId])
      }
    }

    return { data: undefined, factory }
  }

  public async lookupModule(id: string) {
    const moduleData = await this.getModule(id)
    if (moduleData) {
      return { data: moduleData, factory: undefined }
    }

    // Factory auto cache handler
    const factory: SetModuleCacheFactoryFn = async (
      data: any,
      timeout: number = CONFIG.MODULE_TIMEOUT,
    ) => {
      this.setModule(id, data)

      // Actively delete cache when it expires
      this.setTimeout(
        this.timers.modules,
        id,
        () => {
          this.deleteModule(id)
        },
        timeout,
      )
    }

    return { data: undefined, factory }
  }

  public async flushAll() {
    await Promise.all([
      this.clearCompose(),
      this.clearModule(),
      this.clearModulesRefs(),
    ])
  }

  private setTimeout(
    timer: Timer,
    id: ComposeId | ModuleId,
    fn: () => void,
    timeout: number,
  ) {
    this.clearTimeout(timer, id)

    timer[id] = setTimeout(fn, timeout)
  }

  private clearTimeout(timer: Timer, id: ComposeId | ModuleId) {
    if (timer[id]) {
      clearTimeout(timer[id])
    }
  }

  private async setModule(id: string, data: any) {
    this.data.modules.set(id, data)
  }

  private async getModule(id: string) {
    return this.data.modules.get(id)
  }

  async deleteModule(moduleId: ModuleId) {
    const moduleIds = Array.from(this.data.modules.keys())
    const deleteIds = moduleIds.filter(
      (item) => moduleIdHelpers.parser(item).module === moduleId,
    )

    for (const id of deleteIds) {
      this.clearTimeout(this.timers.modules, id)
      this.data.modules.delete(id)
    }
  }

  private async clearModule() {
    const moduleIds = Array.from(this.data.modules.keys())
    for (const id of moduleIds) {
      this.clearTimeout(this.timers.modules, id)
    }

    return this.data.modules.clear()
  }

  private async setCompose(composeId: ComposeId, data: any) {
    this.data.composes.set(composeId, data)
  }

  private async getCompose(composeId: ComposeId) {
    return this.data.composes.get(composeId)
  }

  async deleteCompose(composeId: ComposeId) {
    this.clearTimeout(this.timers.composes, composeId)

    return this.data.composes.delete(composeId)
  }

  private async clearCompose() {
    const composeIds = Array.from(this.data.composes.keys())
    for (const id of composeIds) {
      this.clearTimeout(this.timers.composes, id)
    }

    return this.data.composes.clear()
  }

  private async addModuleRefs(moduleId: ModuleId, composeIds: ComposeId[]) {
    const value = this.data.refs.get(moduleId)
    if (value) {
      for (const composeId of composeIds) {
        value.add(composeId)
      }
    } else {
      this.data.refs.set(moduleId, new Set(composeIds))
    }
  }

  private async removeModuleRefs(moduleId: ModuleId, composeIds: ComposeId[]) {
    const value = this.data.refs.get(moduleId)
    if (value) {
      for (const composeId of composeIds) {
        value.delete(composeId)
      }
    }

    if (value?.size === 0) {
      this.data.refs.delete(moduleId)
    }
  }

  private async getModuleRefs(moduleId: ModuleId) {
    return this.data.refs.get(moduleId)
  }

  private async deleteModuleRefs(moduleId: ModuleId) {
    return this.data.refs.delete(moduleId)
  }

  private async clearModulesRefs() {
    return this.data.refs.clear()
  }
}

export default LocalCache
