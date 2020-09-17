function ensureSlash(path: string): string {
  return path[path.length - 1] === '/' ? path : path + '/'
}

export default ensureSlash
