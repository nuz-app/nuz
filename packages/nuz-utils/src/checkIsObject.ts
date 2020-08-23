function checkIsObject(value: any): boolean {
  return !!(value && typeof value === 'object' && !Array.isArray(value))
}

export default checkIsObject
