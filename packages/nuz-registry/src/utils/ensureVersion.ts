import { integrityHelpers } from '@nuz/utils'

const ensureVersion = async ({
  version,
  library,
  alias,
  exportsOnly,
  resolve: _resolve,
}) => {
  const urls = [_resolve.main, ...(_resolve.styles || [])].filter(Boolean)
  const promises = urls.map(async (url: string) => ({
    url,
    integrity: await integrityHelpers.url(url),
  }))
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
