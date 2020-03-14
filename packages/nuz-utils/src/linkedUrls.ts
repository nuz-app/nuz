import internalIp from 'internal-ip'

export const ipv4 = () => internalIp.v4.sync() || 'http://localhost'

export const modules = (port: number) => `${ipv4()}:${port}`

export const watch = (port: number) => {
  const path = '/watching'
  const host = `${ipv4()}:${port}`
  const url = `${host}${path}`

  return { host, url, path }
}
