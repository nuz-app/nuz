function checkIsHaveSlash(url: string): boolean {
  try {
    const lastChar = url[url.length - 1]
    return lastChar === '/'
  } catch {
    return false
  }
}

export default checkIsHaveSlash
