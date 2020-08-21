function convertMapToObject<T = any>(map: Map<any, any>): T {
  const mapAsList = Array.from(map) as any[]
  return mapAsList.reduce<T>((acc, [key, value]) => {
    acc[key] = value
    return acc
  }, {} as T)
}

export default convertMapToObject
