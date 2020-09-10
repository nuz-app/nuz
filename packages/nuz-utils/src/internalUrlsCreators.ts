const LOCAL_HOST = 'localhost'

export function ipv4(): string {
  return LOCAL_HOST
}

export function modules(port: number): URL {
  const protocol = 'http'
  const hostname = ipv4()
  const pathname = ''

  return new URL(`${protocol}://${hostname}:${port}${pathname}`)
}

export function watch(port: number): URL {
  const protocol = 'http'
  const hostname = ipv4()
  const pathname = '/watching'

  return new URL(`${protocol}://${hostname}:${port}${pathname}`)
}
