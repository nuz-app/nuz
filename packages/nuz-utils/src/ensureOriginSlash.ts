function ensureOriginSlash(value: string): string | undefined {
  try {
    const url = new URL(value)
    return url.origin + '/'
    // tslint:disable-next-line: no-empty
  } catch {}
}

export default ensureOriginSlash
