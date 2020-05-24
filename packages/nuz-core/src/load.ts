import { LoadResult } from './classes/Modules'
import getModules from './utils/effects/getModules'

const load = async <M = any>(moduleName: string): Promise<LoadResult<M>> =>
  getModules().findAndLoadModule<M>(moduleName)

export default load
