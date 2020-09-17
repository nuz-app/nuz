function omit<T = any>(data: any, skips: string[]): T {
  const result = {} as any
  const keys = Object.keys(data || {})

  for (const key of keys) {
    if (!skips.includes(key)) {
      result[key] = data[key]
    }
  }

  return result as T
}

export default omit
