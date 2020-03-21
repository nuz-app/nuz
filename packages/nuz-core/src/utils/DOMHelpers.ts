export interface PreloadConfig {
  [attr: string]: any
  integrity: string | undefined
}

export interface DefinedElement {
  type: string
  attributes: { [attribute: string]: any }
}

const defaultConfigForPreload = {
  rel: 'preload',
  crossOrigin: 'anonymous',
  importance: 'auto',
}

export const createElement = (
  type: string,
  attributes: { [key: string]: any },
): DefinedElement => ({
  type,
  attributes,
})

export const appendToHead = (element: Element) =>
  document.head.appendChild(element)

export const preloadStyle = (href: string, config: PreloadConfig) => {
  const link = createElement(
    'link',
    Object.assign({ href, as: 'style' }, defaultConfigForPreload, config),
  )

  // appendToHead(link)
  return link
}

export const preloadScript = (href: string, config: PreloadConfig) => {
  const link = createElement(
    'link',
    Object.assign({ href, as: 'fetch' }, defaultConfigForPreload, config),
  )

  // appendToHead(link)
  return link
}

export const dnsPrefetch = (href: string, isPreconnect: boolean = false) => {
  const link = createElement('link', {
    href,
    as: 'fetch',
    ref: isPreconnect ? 'preconnect' : 'dns-prefetch',
  })

  // appendToHead(link)
  return link
}

interface StyleConfig {
  integrity: string | undefined
  [attr: string]: any
}

export const loadStyle = (href: string, config?: StyleConfig) => {
  const link = createElement(
    'link',
    Object.assign(
      {
        href,
        type: 'text/css',
        rel: 'stylesheet',
      },
      config,
    ),
  )

  // appendToHead(link)
  return link
}
