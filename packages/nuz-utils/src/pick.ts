function pick<T = any>(data: any, picks: string[]): T {
  const result = {} as any

  for (const key of picks) {
    if (key in data) {
      result[key] = data[key]
    }
  }

  return result as T
}

export default pick
