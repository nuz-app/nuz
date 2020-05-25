import * as bootstrap from './bootstrap'
import getModules from './utils/effects/getModules'

const resolve = async <T = any>(name: string): Promise<T> => {
  await bootstrap.process.ready()

  return getModules().resolveModule<T>(name)
}

export default resolve
