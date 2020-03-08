interface PreloadConfig {
  [attr: string]: string | boolean
  isExternal: boolean
  integrity: string | null
}

const linkFactory = (
  url: string,
  { isExternal, integrity, ...rest }: PreloadConfig,
) => {
  console.log({ document })
  const link = document.createElement('link')

  Object.assign(link, rest, { integrity })
  link.rel = 'preload'
  // @ts-ignore
  link.importance = isExternal ? 'high' : 'auto'
  link.href = url

  return link
}

const appendToHead = (element: Element) => document.head.appendChild(element)

export const preloadStyle = (url: string, config: PreloadConfig) => {
  const link = linkFactory(url, config)
  link.as = 'style'

  appendToHead(link)
  return link
}

export const preloadScript = (url: string, config: PreloadConfig) => {
  const link = linkFactory(url, config)
  link.as = 'fetch'

  appendToHead(link)
  return link
}

interface StyleConfig {
  [attr: string]: string | boolean
  integrity: string | null
}

export const loadStyle = (url: string, config?: StyleConfig) => {
  const link = document.createElement('link')

  Object.assign(link, config)
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = url

  appendToHead(link)
  return link
}
