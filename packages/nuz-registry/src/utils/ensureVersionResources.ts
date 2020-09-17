import { integrityHelpers } from '@nuz/utils'

import { Resource, VersionInfo } from '../types'

async function getOrVerifyIntegrity(item: string | Resource) {
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

async function ensureVersionResources(_resolve: VersionInfo['resolve']) {
  const urls = [_resolve.main, ...(_resolve.styles || [])].filter(Boolean)

  const [main, ...styles] = await Promise.all(
    urls.map(getOrVerifyIntegrity).filter(Boolean),
  )

  return {
    main,
    styles: styles.length > 0 ? styles : undefined,
  }
}

export default ensureVersionResources
