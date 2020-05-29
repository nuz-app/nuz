import { moduleIdHelpers } from '@nuz/utils'

import * as bootstrap from './bootstrap'
import { LoadResult } from './classes/Modules'
import getModules from './utils/effects/getModules'

export default async function load<M = any>(
  idOrName: string,
): Promise<LoadResult<M>> {
  await bootstrap.process.ready()

  const id = moduleIdHelpers.use(idOrName)

  return getModules().findAndLoadModule<M>(id)
}
