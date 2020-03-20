const LOCAL_HOST = 'localhost'

export const ipv4 = () => LOCAL_HOST

export const modules = (port: number): URL => {
  const protocol = 'http'
  const hostname = ipv4()
  const pathname = ''

  return new URL(`${protocol}://${hostname}:${port}${pathname}`)
}

export const watch = (port: number): URL => {
  const protocol = 'http'
  const hostname = ipv4()
  const pathname = '/watching'

  return new URL(`${protocol}://${hostname}:${port}${pathname}`)
}
