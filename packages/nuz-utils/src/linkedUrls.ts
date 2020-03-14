import internalIp from 'internal-ip'

export const ipv4 = () => internalIp.v4.sync() || 'http://localhost'

export const modules = (port: number) => `${ipv4()}:${port}`
