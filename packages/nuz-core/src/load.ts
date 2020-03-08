import { LoadResults } from './classes/Modules'
import getModules from './utils/effects/getModules'

const load = async <M = any>(moduleName: string): Promise<LoadResults<M>> =>
  getModules().loadByName<M>(moduleName)

export default load
