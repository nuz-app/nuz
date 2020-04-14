const pick = <T = unknown>(data: any, keys: string[]): T => {
  const result = {} as T

  for (const key of keys) {
    if (data[key] !== undefined) {
      result[key] = data[key]
    }
  }

  return result as T
}

export default pick
