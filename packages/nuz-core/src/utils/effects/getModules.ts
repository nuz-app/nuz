import { MODULES_KEY } from '@nuz/shared'

import Modules from '../../classes/Modules'
import * as selfHelpers from '../selfHelpers'
export { default as Modules } from '../../classes/Modules'

let referenceModules = (selfHelpers.get() as any)[MODULES_KEY]

export function initializeModules(): Modules {
  if (!referenceModules) {
    referenceModules = new Modules()
    selfHelpers.set(MODULES_KEY, referenceModules)
  }

  return referenceModules
}

function getModules(): Modules {
  return referenceModules
}

export default getModules
