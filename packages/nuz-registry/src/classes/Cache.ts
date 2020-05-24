import { ComposeId, ModuleId } from '../types'

export type SetComposeCacheFactoryFn = (
  data: any,
  deps: ModuleId[],
  timeout?: number,
) => Promise<void>

export type SetModuleCacheFactoryFn = (
  data: any,
  timeout?: number,
) => Promise<void>

declare class Cache {
  prepare(): Promise<any>

  clearAllRefsToModule(moduleId: ModuleId): Promise<any>

  lookupCompose(
    composeId: ComposeId,
  ): Promise<{ data?: any; factory?: SetComposeCacheFactoryFn }>

  deleteCompose(composeId: ComposeId): Promise<any>

  lookupModule(
    moduleId: ModuleId,
  ): Promise<{ data?: any; factory?: SetModuleCacheFactoryFn }>

  deleteModule(moduleId: ModuleId): Promise<any>

  flushAll(): Promise<void>
}

export default Cache
