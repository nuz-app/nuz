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

export const defineElement = (
  type: string,
  attributes: { [key: string]: any },
): DefinedElement => ({
  type,
  attributes,
})

export const domIsExsted = () => typeof document !== 'undefined'

export const appendToHead = (element: Element) =>
  document.head.appendChild(element)

export const createElement = (defined: DefinedElement) => {
  const { type, attributes } = defined

  const element = document.createElement(type)

  const keysOf = Object.keys(attributes)
  keysOf.forEach((key) => {
    if (attributes[key] === undefined) {
      return
    }

    element[key] = attributes[key]
  })

  return element
}

export const preloadStyle = (href: string, config: PreloadConfig) => {
  const defined = defineElement(
    'link',
    Object.assign({ href, as: 'style' }, defaultConfigForPreload, config),
  )

  return defined
}

export const preloadScript = (href: string, config: PreloadConfig) => {
  const defined = defineElement(
    'link',
    Object.assign({ href, as: 'fetch' }, defaultConfigForPreload, config),
  )

  return defined
}

export const dnsPrefetch = (href: string, isPreconnect: boolean = false) => {
  const defined = defineElement('link', {
    rel: isPreconnect ? 'preconnect' : 'dns-prefetch',
    href,
  })

  return defined
}

interface StyleConfig {
  integrity: string | undefined
  [attr: string]: any
}

export const loadStyle = (href: string, config?: StyleConfig) => {
  const defined = defineElement(
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

  if (domIsExsted()) {
    appendToHead(createElement(defined))
  }

  return defined
}
