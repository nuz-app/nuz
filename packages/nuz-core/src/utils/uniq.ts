const uniq = (...rest: any[]) =>
  [...new Set([].concat(...rest))].filter(Boolean)

export default uniq
