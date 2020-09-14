import { SHARED_CONFIG_KEY } from '@nuz/shared'
import type LRUCache from 'lru-cache'
import serialize from 'serialize-javascript'

import appendQueryToUrl, {
  AppendQueryToUrlConfiguration,
} from './appendQueryToUrl'
import downloadResource from './downloadResource'

export enum Priorities {
  auto = 'auto',
  high = 'high',
}

export interface PreloadConfiguration {
  [attr: string]: any
  integrity: string | undefined
  sourceMap: boolean
}

export interface DefinedElement {
  type: string
  attributes: { [attribute: string]: any }
}

const defaultPreloadConfiguration = {
  rel: 'preload',
  crossOrigin: 'anonymous',
  importance: 'auto',
}

export function defineElement(
  type: string,
  attributes: { [key: string]: any },
): DefinedElement {
  return {
    type,
    attributes,
  }
}

export function canUse(): boolean {
  return typeof document !== 'undefined'
}

export function appendHead(element: Element): Element {
  return document.getElementsByTagName('head')[0].appendChild(element)
}

export function createElement(defined: DefinedElement): Element {
  const { type, attributes } = defined

  const element = document.createElement(type)
  const keys = Object.keys(attributes)

  for (const key of keys) {
    if (key === 'dangerouslySetInnerHTML') {
      element.innerHTML = attributes.dangerouslySetInnerHTML.__html
    } else if (attributes[key]) {
      element.setAttribute(key, attributes[key])
    }
  }

  return element
}

export function preloadStyle(
  href: string,
  configuration: PreloadConfiguration,
): DefinedElement {
  const { sourceMap, ...rest } = configuration

  return defineElement(
    'link',
    Object.assign(
      {
        priority: Priorities.auto,
        // Update the url to add source map if it is a dev environment.
        href: appendQueryToUrl(href, {
          sourceMap,
        } as AppendQueryToUrlConfiguration),
        as: 'style',
      },
      defaultPreloadConfiguration,
      rest,
    ),
  )
}

export function preloadScript(
  href: string,
  configuration: PreloadConfiguration,
): DefinedElement {
  const { sourceMap, ...rest } = configuration

  return defineElement(
    'link',
    Object.assign(
      {
        priority: Priorities.auto,
        // Update the url to add source map if it is a dev environment.
        href: appendQueryToUrl(href, {
          sourceMap,
        } as AppendQueryToUrlConfiguration),
        as: 'fetch',
      },
      defaultPreloadConfiguration,
      rest,
    ),
  )
}

export function dnsPrefetch(
  href: string,
  isPreconnect: boolean = false,
): DefinedElement {
  return defineElement('link', {
    priority: Priorities.auto,
    rel: isPreconnect ? 'preconnect' : 'dns-prefetch',
    href,
  })
}

interface StyleConfig {
  [attr: string]: any
  integrity: string | undefined
  sourceMap: boolean
  resolver?: LRUCache<any, any>
}

export async function loadStyle(
  href: string,
  configuration?: StyleConfig,
): Promise<DefinedElement> {
  const { resolver, integrity, sourceMap, ...rest } = configuration || {}

  let style
  if (canUse()) {
    const element = document.querySelector(`style[data-href="${href}"]`)
    style = element?.innerHTML
  }

  if (!style) {
    style = await downloadResource(href, { resolver, sourceMap, integrity })
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

  if (canUse()) {
    appendHead(createElement(defined))
  }

  return defined
}

export function defineSharedConfig(configuration: any): DefinedElement {
  return defineElement('script', {
    priority: Priorities.high,
    type: 'text/javascript',
    dangerouslySetInnerHTML: {
      __html: `window['${SHARED_CONFIG_KEY}'] = ${serialize(configuration, {
        isJSON: true,
      })}`,
    },
  })
}
