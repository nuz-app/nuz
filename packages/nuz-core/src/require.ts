import { moduleIdHelpers } from '@nuz/utils'

import bootstrap from './bootstrap'
import * as shared from './shared'
import getModules from './utils/effects/getModules'

export default async function <T = any>(idOrName: string): Promise<T> {
  if (!shared.state.initialized) {
    bootstrap({})
  }

  await shared.process.ready()

  const id = moduleIdHelpers.use(idOrName)

  return getModules().requireModule<T>(id)
}
