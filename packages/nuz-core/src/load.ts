import { moduleIdHelpers } from '@nuz/utils'

import bootstrap from './bootstrap'
import { LoadResult } from './classes/Modules'
import * as shared from './shared'
import getModules from './utils/effects/getModules'

export default async function load<M = any>(
  idOrName: string,
): Promise<LoadResult<M>> {
  if (!shared.state.initialized) {
    bootstrap({})
  }

  await shared.process.ready()

  const id = moduleIdHelpers.use(idOrName)

  return getModules().findAndLoadModule<M>(id)
}
