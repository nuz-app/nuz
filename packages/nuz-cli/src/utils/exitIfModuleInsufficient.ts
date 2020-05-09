import { ModuleConfig } from '../types'

const exitIfModuleInsufficient = (moduleConfig: ModuleConfig) => {
  const { name, input, output } = moduleConfig || {}

  if (!name) {
    throw new Error(
      'Missing `name` field in `nuz.config.js` file, this is module name!',
    )
  }

  if (!input) {
    throw new Error('Missing `input` field in `nuz.config.js` file!')
  }

  if (!output) {
    throw new Error('Missing `output` field in `nuz.config.js` file!')
  }
}

export default exitIfModuleInsufficient
