const validateModuleId = (moduleId: string) =>
  !moduleId ||
  !/([^a-zA-Z0-9\-\.\@\/]+)|(\.|\-|\@\/)$|^(\.|\-|\@\/)/.test(moduleId)

export default validateModuleId
