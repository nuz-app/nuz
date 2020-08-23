import Processs from './classes/Process'
import * as reexports from './exports'
import * as react from './factories/react'
import * as shared from './shared'
import { BootstrapConfiguration } from './types'

async function bootstrap(
  _configurationuration: BootstrapConfiguration,
): Promise<Processs> {
  // Mark float to know bootstrap called
  shared.state.initialized = true

  // Inject to `react` and `react-dom` render process
  const deps = react.integrate({
    react: require('react'),
    'react-dom': require('react-dom'),
  })

  // Update configuration before initialize
  const configuration = Object.assign({}, _configurationuration, {
    vendors: Object.assign(
      {
        '@nuz/core': reexports,
      },
      deps,
      _configurationuration.vendors,
    ),
  })

  // Initialize the process
  await shared.process.initialize(configuration)

  return shared.process
}

export default bootstrap
