function ensureOrigin(value: string): string {
  try {
    const url = new URL(value)
    return url.origin
    // tslint:disable-next-line: no-empty
  } catch {}

  throw new Error(`Received is invalid URL, value: ${JSON.stringify(value)}`)
}

export default ensureOrigin
