import getModules from './utils/effects/getModules'

const resolve = async <T = any>(name: string): Promise<T> =>
  getModules().requireByName<T>(name)

export default resolve
