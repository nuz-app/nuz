import { integrityHelpers } from '@nuz/utils'

import { Resource, VersionInfo } from '../types'

const getOrVerifyIntegrity = async (item: string | Resource) => {
  const isObject = typeof item === 'object'
  const itemUrl = (item as any).url

  const url = isObject ? itemUrl : item
  let integrity
  try {
    integrity = (await integrityHelpers.url(url)) as string
  } catch {
    throw new Error(
      `Can't get integrity of file, make sure the file was uploaded to the CDNs, url: ${url}.`,
    )
  }

  return {
    url,
    integrity,
  }
}

const ensureVersionResources = async (_resolve: VersionInfo['resolve']) => {
  const urls = [_resolve.main, ...(_resolve.styles || [])].filter(Boolean)
  const promises = urls.map(getOrVerifyIntegrity)
  const [main, ...styles] = await Promise.all(promises.filter(Boolean))
  const resolve = {
    main,
    styles: styles.length > 0 ? styles : undefined,
  }

  return resolve
}

export default ensureVersionResources
