const ensureOriginSlash = (value: string): string | undefined => {
  try {
    const url = new URL(value)
    return url.origin + '/'
  } catch {}
}

export default ensureOriginSlash
