function uniq<T extends unknown>(...rest: any[]): T {
  return [...new Set([].concat(...rest))].filter(Boolean) as T
}

export default uniq
