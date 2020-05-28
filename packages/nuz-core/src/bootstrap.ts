import { BootstrapConfig } from './types'

import Extractor from './classes/Extractor'
import Processs from './classes/Process'

export const process = new Processs()

export const extractor = new Extractor()

async function bootstrap(configAsRaw: BootstrapConfig) {
  await process.initial(configAsRaw)

  return process
}

export default bootstrap
