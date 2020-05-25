import * as bootstrap from './bootstrap'
import { LoadResult } from './classes/Modules'
import getModules from './utils/effects/getModules'

async function load<M = any>(id: string): Promise<LoadResult<M>> {
  await bootstrap.process.ready()

  return getModules().findAndLoadModule<M>(id)
}

export default load
