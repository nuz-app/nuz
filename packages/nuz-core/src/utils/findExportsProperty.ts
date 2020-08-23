function findExportsProperty(module: any, named?: string): string {
  // If the module exports with a name
  if (named !== '[name]' && module[named as string]) {
    return named as string
  }

  // If the module is exported with default
  if (module.default) {
    return 'default'
  }

  // In some cases, it may be `main`
  if (module.main) {
    return 'main'
  }

  // Get the last property in the module
  const properties = Object.keys(module)
  return properties[properties.length - 1]
}

export default findExportsProperty
