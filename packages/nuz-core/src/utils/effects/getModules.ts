import { MODULES as MODULES_KEY } from '../../lib/symbols'

import Modules from '../../classes/Modules'

import * as selfHelpers from '../selfHelpers'

export let refModules = selfHelpers.get()[MODULES_KEY]

export const initModules = () => {
  if (!refModules) {
    refModules = new Modules()
    selfHelpers.set(MODULES_KEY, refModules)
  }
}

const getModules = (): Modules => refModules

export default getModules
