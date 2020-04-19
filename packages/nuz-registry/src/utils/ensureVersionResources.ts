import { integrityHelpers } from '@nuz/utils'

import { VersionInfo } from '../types'

const getOrVerifyIntegrity = async (
  item: string | { url: string; integrity: string | null },
) => {
  const isObject = typeof item === 'object'
  const itemUrl = (item as any).url
  const itemIntegrity = (item as any).integrity

  const url = isObject ? itemUrl : item
  const integrity = (await integrityHelpers.url(url)) as string

  const integrityIsNotMatched =
    isObject && itemIntegrity && integrity !== itemIntegrity
  if (integrityIsNotMatched) {
    throw new Error(
      `Integrity of resource is not matched. Expected: "${itemIntegrity}" but received "${integrity}"!`,
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
