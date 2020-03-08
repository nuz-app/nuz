import { integrityHelpers } from '@nuz/utils'

const getOrVerifyIntegrity = async (
  item: string | { url: string; integrity: string },
) => {
  const isVerify = typeof item === 'object'
  const itemUrl = (item as any).url
  const itemIntegrity = (item as any).integrity

  const url = isVerify ? itemUrl : item
  const integrity = (await integrityHelpers.url(url)) as string

  const integrityIsNotMatched = isVerify && integrity !== itemIntegrity
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

const ensureVersion = async ({
  version,
  library,
  alias,
  exportsOnly,
  resolve: _resolve,
}) => {
  const urls = [_resolve.main, ...(_resolve.styles || [])].filter(Boolean)
  const promises = urls.map(getOrVerifyIntegrity)
  const [main, ...styles] = await Promise.all(promises.filter(Boolean))
  const resolve = {
    main,
    styles: styles.length > 0 ? styles : undefined,
  }

  return {
    version,
    library,
    alias,
    exportsOnly,
    resolve,
  }
}

export default ensureVersion
