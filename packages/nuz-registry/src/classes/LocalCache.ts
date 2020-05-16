import { ComposeId, ModuleId } from '../types'

import Cache, { FactoryFn } from './Cache'

const CONFIG = {
  COMPOSITION_TIMEOUT: 12 * 60 * 60 * 1000,
}

class LocalCache implements Cache {
  private readonly data: {
    refs: Map<string, Set<string>>
    composes: Map<string, any>
  }

  constructor() {
    const composes = new Map<string, any>()
    const refs = new Map<string, Set<string>>()

    this.data = {
      composes,
      refs,
    }
  }

  // tslint:disable-next-line: no-empty
  async prepare() {}

  async clearAllRefsToModule(moduleId: ModuleId) {
    const composeIds = Array.from((await this.getModuleRefs(moduleId)) || [])
    for (const composeId of composeIds) {
      this.deleteCompose(composeId)
    }

    this.deleteModuleRefs(moduleId)
  }

  async lookupCompose(composeId: ComposeId) {
    const composeData = await this.getCompose(composeId)
    if (composeData) {
      return { data: composeData, factory: undefined }
    }

    // Factory auto cache handler
    const factory: FactoryFn = async (
      data: any,
      deps: ModuleId[],
      timeout: number = CONFIG.COMPOSITION_TIMEOUT,
    ) => {
      this.setCompose(composeId, data)

      // Actively delete cache when it expires
      setTimeout(() => {
        this.deleteCompose(composeId)

        // Remove refs to dependencies
        for (const moduleId of deps) {
          this.removeModuleRefs(moduleId, [composeId])
        }
      }, timeout)

      // Add refs to dependencies
      for (const moduleId of deps) {
        this.addModuleRefs(moduleId, [composeId])
      }
    }

    return { data: undefined, factory }
  }

  async flushAll() {
    await Promise.all([this.clearCompose(), this.clearModulesRefs()])
  }

  private async setCompose(composeId: ComposeId, data: any) {
    this.data.composes.set(composeId, data)
  }

  private async getCompose(composeId: ComposeId) {
    return this.data.composes.get(composeId)
  }

  async deleteCompose(composeId: ComposeId) {
    return this.data.composes.delete(composeId)
  }

  private async clearCompose() {
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
