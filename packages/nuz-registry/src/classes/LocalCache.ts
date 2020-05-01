import { CompositionId, ModuleId } from '../types'

import Cache, { FactoryFn } from './Cache'

const CONFIG = {
  COMPOSITION_TIMEOUT: 12 * 60 * 60 * 1000,
}

class LocalCache implements Cache {
  private readonly data: {
    refs: Map<string, Set<string>>
    compositions: Map<string, any>
  }

  constructor() {
    const compositions = new Map<string, any>()
    const refs = new Map<string, Set<string>>()

    this.data = {
      compositions,
      refs,
    }
  }

  async prepare() {}

  async clearAllRefsToModule(moduleId: ModuleId) {
    const compositionIds = Array.from(
      (await this.getModuleRefs(moduleId)) || [],
    )
    for (const compositionId of compositionIds) {
      this.deleteComposition(compositionId)
    }

    this.deleteModuleRefs(moduleId)
  }

  async lookupComposition(compositionId: CompositionId) {
    const compositionData = await this.getComposition(compositionId)
    if (compositionData) {
      return { data: compositionData, factory: undefined }
    }

    // Factory auto cache handler
    const factory: FactoryFn = async (
      data: any,
      deps: ModuleId[],
      timeout: number = CONFIG.COMPOSITION_TIMEOUT,
    ) => {
      this.setComposition(compositionId, data)

      // Actively delete cache when it expires
      setTimeout(() => {
        this.deleteComposition(compositionId)

        // Remove refs to dependencies
        for (const moduleId of deps) {
          this.removeModuleRefs(moduleId, [compositionId])
        }
      }, timeout)

      // Add refs to dependencies
      for (const moduleId of deps) {
        this.addModuleRefs(moduleId, [compositionId])
      }
    }

    return { data: undefined, factory }
  }

  async flushAll() {
    await Promise.all([this.clearCompositions(), this.clearModulesRefs()])
  }

  private async setComposition(compositionId: CompositionId, data: any) {
    this.data.compositions.set(compositionId, data)
  }

  private async getComposition(compositionId: CompositionId) {
    return this.data.compositions.get(compositionId)
  }

  private async deleteComposition(compositionId: CompositionId) {
    return this.data.compositions.delete(compositionId)
  }

  private async clearCompositions() {
    return this.data.compositions.clear()
  }

  private async addModuleRefs(
    moduleId: ModuleId,
    compositionIds: CompositionId[],
  ) {
    const value = this.data.refs.get(moduleId)
    if (value) {
      for (const compositionId of compositionIds) {
        value.add(compositionId)
      }
    } else {
      this.data.refs.set(moduleId, new Set(compositionIds))
    }
  }

  private async removeModuleRefs(
    moduleId: ModuleId,
    compositionIds: CompositionId[],
  ) {
    const value = this.data.refs.get(moduleId)
    if (value) {
      for (const compositionId of compositionIds) {
        value.delete(compositionId)
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
