import { NUZ_REGISTRY_DOMAIN } from '@nuz/shared'
import qs from 'qs'

const getRegistryFetchUrl = (
  composition: string,
  domain: string = NUZ_REGISTRY_DOMAIN,
) => `https://${domain}/fetch?${qs.stringify({ composition })}`

export default getRegistryFetchUrl
