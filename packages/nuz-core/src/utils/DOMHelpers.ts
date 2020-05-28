import { SHARED_CONFIG_KEY } from '@nuz/shared'
import { jsonHelpers } from '@nuz/utils'
import LRUCache from 'lru-cache'

import appendQueryToUrl, { AppendConfig } from './appendQueryToUrl'
import getScript from './getScript'

export enum Priorities {
  auto = 'auto',
  high = 'high',
}

export interface PreloadConfig {
  [attr: string]: any
  integrity: string | undefined
  sourceMap: boolean
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

    if (key === 'dangerouslySetInnerHTML') {
      element.innerHTML = attributes.dangerouslySetInnerHTML.__html
      return
    }

    element.setAttribute(key, attributes[key])
  })

  return element
}

export const preloadStyle = (
  href: string,
  { sourceMap, ...rest }: PreloadConfig,
) => {
  const updatedHref = appendQueryToUrl(href, { sourceMap } as AppendConfig)
  const defined = defineElement(
    'link',
    Object.assign(
      { priority: Priorities.auto, href: updatedHref, as: 'style' },
      defaultConfigForPreload,
      rest,
    ),
  )

  return defined
}

export const preloadScript = (
  href: string,
  { sourceMap, ...rest }: PreloadConfig,
) => {
  const updatedHref = appendQueryToUrl(href, { sourceMap } as AppendConfig)
  const defined = defineElement(
    'link',
    Object.assign(
      { priority: Priorities.auto, href: updatedHref, as: 'fetch' },
      defaultConfigForPreload,
      rest,
    ),
  )

  return defined
}

export const dnsPrefetch = (href: string, isPreconnect: boolean = false) => {
  const defined = defineElement('link', {
    priority: Priorities.auto,
    rel: isPreconnect ? 'preconnect' : 'dns-prefetch',
    href,
  })

  return defined
}

interface StyleConfig {
  [attr: string]: any
  integrity: string | undefined
  sourceMap: boolean
  resolver?: LRUCache<any, any>
}

export const loadStyle = async (href: string, config?: StyleConfig) => {
  const { resolver, integrity, sourceMap, ...rest } = config || {}

  let style
  if (domIsExsted()) {
    const element = document.querySelector(`style[data-href="${href}"]`)
    style = element?.innerHTML
  }

  if (!style) {
    style = await getScript(href, { resolver, sourceMap, integrity })
  }

  const defined = defineElement(
    'style',
    Object.assign(
      {
        priority: Priorities.auto,
        type: 'text/css',
        'data-href': href,
        dangerouslySetInnerHTML: {
          __html: style,
        },
      },
      rest,
    ),
  )
  if (domIsExsted()) {
    appendToHead(createElement(defined))
  }

  return defined
}

export const sharedConfig = (config: any) => {
  const defined = defineElement('script', {
    priority: Priorities.high,
    type: 'text/javascript',
    dangerouslySetInnerHTML: {
      __html: `window['${SHARED_CONFIG_KEY}'] = ${jsonHelpers.stringify(
        config,
      )};`,
    },
  })

  return defined
}
