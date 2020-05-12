function checkIsUrl(url: string) {
  try {
    const v = new URL(url)
    return true
  } catch {
    return false
  }
}

export default checkIsUrl
