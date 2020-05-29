import { moduleIdHelpers } from '@nuz/utils'

import * as shared from './shared'
import getModules from './utils/effects/getModules'

export default async function <T = any>(idOrName: string): Promise<T> {
  await shared.process.ready()

  const id = moduleIdHelpers.use(idOrName)

  return getModules().requireModule<T>(id)
}
