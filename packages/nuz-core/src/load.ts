import { moduleIdHelpers } from '@nuz/utils'

import bootstrap from './bootstrap'
import { ResolvedModule } from './classes/Modules'
import * as shared from './shared'
import getModules from './utils/effects/getModules'

export default async function load<M extends unknown>(
  idOrName: string,
): Promise<ResolvedModule<M>> {
  if (!shared.state.initialized) {
    bootstrap({})
  }

  // Wait for the process to be ready
  await shared.process.isReady()

  // Get module id
  const id = moduleIdHelpers.use(idOrName)

  // Install the module
  return getModules().install<M>(id)
}
