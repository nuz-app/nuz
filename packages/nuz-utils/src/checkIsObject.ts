const checkIsObject = (value: any) =>
  value && typeof value === 'object' && !Array.isArray(value)

export default checkIsObject
