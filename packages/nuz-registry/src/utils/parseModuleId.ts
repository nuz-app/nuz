import { validator } from '@nuz/utils'

function parseModuleId(moduleId: string) {
  const matched = moduleId.match(validator.MODULE_ID_REGEXP)
  if (matched) {
    return {
      scope: matched[2],
      name: matched[3],
    }
  }

  return null
}

export default parseModuleId
