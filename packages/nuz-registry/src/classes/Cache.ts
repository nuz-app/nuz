import { ComposeId, ModuleId } from '../types'

export type FactoryFn = (
  data: any,
  deps: ModuleId[],
  timeout?: number,
) => Promise<void>

declare class Cache {
  prepare(): Promise<any>

  clearAllRefsToModule(moduleId: ModuleId): Promise<any>

  lookupCompose(
    composeId: ComposeId,
  ): Promise<{ data?: any; factory?: FactoryFn }>

  deleteCompose(composeId: ComposeId): Promise<any>

  flushAll(): Promise<void>
}

export default Cache
