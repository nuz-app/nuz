const MODULE_ID_REGEXP = /^(\@([a-zA-Z]{1}[a-zA-Z0-9\.\-]+[a-zA-Z]{1})\/)?([a-zA-Z]{1}[a-zA-Z0-9\.\-]+)$/

export const validate = (moduleId: string) =>
  moduleId && MODULE_ID_REGEXP.test(moduleId)

export const parse = (moduleId: string) => {
  const matched = moduleId.match(MODULE_ID_REGEXP)
  if (matched) {
    return {
      scope: matched[2],
      name: matched[3],
    }
  }

  return null
}
