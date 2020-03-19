import { MODULES_KEY } from '@nuz/shared'

import Modules from '../../classes/Modules'

import * as selfHelpers from '../selfHelpers'

export let refModules = (selfHelpers.get() as any)[MODULES_KEY]

export const initModules = () => {
  if (!refModules) {
    refModules = new Modules()
    selfHelpers.set(MODULES_KEY, refModules)
  }
}

const getModules = (): Modules => refModules

export default getModules
