import * as bootstrap from './bootstrap'
import { LoadResult } from './classes/Modules'
import getModules from './utils/effects/getModules'

const load = async <M = any>(moduleName: string): Promise<LoadResult<M>> => {
  await bootstrap.process.ready()

  return getModules().findAndLoadModule<M>(moduleName)
}

export default load
