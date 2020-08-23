import { checkIsObject } from '@nuz/utils'

import { RequiredModuleConfiguration } from '../types'

/**
 * Merge modules configuration from upstream and local
 */
function mergeModuleConfiguration(
  upstream: any,
  local: RequiredModuleConfiguration,
): RequiredModuleConfiguration {
  // If the upstream configuration is not available or incorrect,
  // use the current configuration.
  if (!upstream || !checkIsObject(upstream)) {
    return local
  }

  // If upstream configuration is present, merge them together.
  return Object.assign({}, local, {
    library: upstream.library || local.library,
    alias: upstream.alias || local.alias,
    format: upstream.format || local.format,
    exportsOnly: upstream.exportsOnly || local.exportsOnly,
  })
}

export default mergeModuleConfiguration
