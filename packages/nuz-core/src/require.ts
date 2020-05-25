import * as bootstrap from './bootstrap'
import getModules from './utils/effects/getModules'

export default async function <T = any>(id: string): Promise<T> {
  await bootstrap.process.ready()

  return getModules().requireModule<T>(id)
}
