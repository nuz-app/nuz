import getModules from './utils/effects/getModules'

const resolve = async <T = any>(name: string): Promise<T> =>
  getModules().resolveModule<T>(name)

export default resolve
