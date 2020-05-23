import qs from 'qs'

const getConfigUrl = (compose: string, registry: string) =>
  `${registry}/fetch?${qs.stringify({ compose })}`

export default getConfigUrl
