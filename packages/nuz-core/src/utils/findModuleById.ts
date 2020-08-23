import { moduleIdHelpers } from '@nuz/utils'

import { RequiredModuleConfiguration } from '../types'

function findModuleById(
  modules: RequiredModuleConfiguration[],
  id: string,
): RequiredModuleConfiguration | undefined {
  let match = modules.find((item) => item.id === id)
  if (!match) {
    const parsed = moduleIdHelpers.parser(id)
    if (parsed.version === '*') {
      match = modules.find((item) => item.name === parsed.module)
    }
  }

  return match
}

export default findModuleById
