const uniq = (...rest) => [...new Set([].concat(...rest))].filter(Boolean)

export default uniq
