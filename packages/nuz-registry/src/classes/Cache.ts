import { CompositionId, ModuleId } from '../types'

export type FactoryFn = (
  data: any,
  deps: ModuleId[],
  timeout?: number,
) => Promise<void>

declare class Cache {
  prepare(): Promise<any>

  clearAllRefsToModule(moduleId: ModuleId): Promise<any>

  lookupComposition(
    compositionId: CompositionId,
  ): Promise<{ data?: any; factory?: FactoryFn }>

  flushAll(): Promise<void>
}

export default Cache
