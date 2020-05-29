import { moduleIdHelpers } from '@nuz/utils'

import * as bootstrap from './bootstrap'
import getModules from './utils/effects/getModules'

export default async function <T = any>(idOrName: string): Promise<T> {
  await bootstrap.process.ready()

  const id = moduleIdHelpers.use(idOrName)

  return getModules().requireModule<T>(id)
}
