function checkIsUrl(url: string): boolean {
  try {
    // @ts-ignore
    const value = new URL(url)
    return true
  } catch {
    return false
  }
}

export default checkIsUrl
