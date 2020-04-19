const SCOPE_ID_REGEXP = /^([a-zA-Z]{1}[a-zA-Z0-9\.\-]+[a-zA-Z]{1})\/)$/

export const validate = (moduleId: string) =>
  moduleId && SCOPE_ID_REGEXP.test(moduleId)
