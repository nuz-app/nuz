const cache = new Map()

const hardCacheOnTime = async <T = unknown>(
  fn: () => Promise<T>,
  key: any,
  timeout: number,
  prepare?: number,
): Promise<T> => {
  if (!timeout) {
    const result = await fn()
    return result
  }

  if (!cache.has(key)) {
    const result = await fn()
    cache.set(key, result)

    setTimeout(() => cache.delete(key), timeout)

    if (prepare) {
      if (timeout < prepare) {
        throw new Error('Cache time not allow to smaller prepare time!')
      }

      setTimeout(async () => cache.set(key, await fn()), timeout - prepare)
    }
  }

  return cache.get(key)
}

export default hardCacheOnTime
