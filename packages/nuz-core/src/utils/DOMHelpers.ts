interface PreloadConfig {
  [attr: string]: any
  integrity: string | undefined
}

const linkFactory = (url: string, { integrity, ...rest }: PreloadConfig) => {
  const link = document.createElement('link')

  Object.assign(link, rest, { integrity })
  link.rel = 'preload'
  link.crossOrigin = 'anonymous'
  // @ts-ignore
  link.importance = 'auto'
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

export const dnsPrefetch = (url: string) => {
  const link = document.createElement('link')

  link.rel = 'dns-prefetch'
  link.href = url

  appendToHead(link)
  return link
}

interface StyleConfig {
  integrity: string | undefined
  [attr: string]: any
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
