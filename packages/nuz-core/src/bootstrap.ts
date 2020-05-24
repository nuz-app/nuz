import { BootstrapConfig } from './types'

import Processs from './classes/Process'

export const process = new Processs()

async function bootstrap(configAsRaw: BootstrapConfig) {
  await process.initial(configAsRaw)

  return process
}

export default bootstrap
