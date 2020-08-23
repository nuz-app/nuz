function convertMapToObject<T extends any>(map: Map<any, any>): T {
  const mapAsList = Array.from(map) as any[]
  return mapAsList.reduce<T>((acc, [key, value]) => {
    // tslint:disable-next-line: semicolon
    ;(acc as any)[key] = value
    return acc
  }, {} as any)
}

export default convertMapToObject
