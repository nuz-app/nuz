const validateModuleId = (moduleId: string) =>
  !moduleId || !/\.$|\_/.test(moduleId)

export default validateModuleId
