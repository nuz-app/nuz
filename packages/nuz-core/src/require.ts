import { moduleIdHelpers } from '@nuz/utils'

import bootstrap from './bootstrap'
import * as shared from './shared'
import getModules from './utils/effects/getModules'

async function _require<M extends unknown>(idOrName: string): Promise<M> {
  if (!shared.state.initialized) {
    bootstrap({})
  }

  // Wait for the process to be ready
  await shared.process.isReady()

  // Get module id
  const id = moduleIdHelpers.use(idOrName)

  // Require module by id
  return getModules().require<M>(id)
}

export default _require
