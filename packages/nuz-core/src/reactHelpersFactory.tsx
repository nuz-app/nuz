import { REACT_DOM_INJECTED } from '@nuz/shared'

import * as DOMHelpers from './utils/DOMHelpers'

import getTagsInHead from './getTagsInHead'
import * as waitToReady from './waitToReady'

export interface ReactHelpersConfig {
  React: any
  ReactDOM: any
}

export interface ReactHelpersFactoryOptions {
  autoInject?: boolean
}

export interface AppProps {
  component?: React.ElementType
  injectHead?: React.ElementType
}

export function factoryInjectReact({ React, ReactDOM }) {
  const originalRender = ReactDOM.render.bind(ReactDOM)
  const originalHydrate = ReactDOM.hydrate.bind(ReactDOM)

  return () => {
    if (ReactDOM[REACT_DOM_INJECTED]) {
      return false
    }

    const renderFactory = (fn: any) =>
      async function renderInjected(element, container, callback?) {
        await waitToReady.wait()

        return fn(element, container, callback)
      }

    Object.assign(ReactDOM, {
      render: renderFactory(originalRender),
      hydrate: renderFactory(originalHydrate),
    })

    Object.defineProperty(ReactDOM, REACT_DOM_INJECTED, { value: true })

    return true
  }
}

const defaultOptions = {
  autoInject: true,
}

function reactHelpersFactory(
  { React, ReactDOM }: ReactHelpersConfig,
  options?: ReactHelpersFactoryOptions,
) {
  const { autoInject } = Object.assign({}, defaultOptions, options)

  if (!React) {
    throw new Error(
      'React fields in config is required to use `reactHelpersFactory` helper!',
    )
  }

  if (!ReactDOM) {
    throw new Error(
      'ReactDOM fields in config is required to use `reactHelpersFactory` helper!',
    )
  }

  const { useMemo } = React

  const App: React.FunctionComponent<AppProps> = ({
    component: Component = 'main',
    injectHead: InjectHead,
    children,
    ...rest
  }) => {
    const head = useMemo(() => {
      const definedTags = getTagsInHead() || []
      const injectHeadIsNotFound = !InjectHead
      const tags = injectHeadIsNotFound
        ? definedTags
        : definedTags.map((item) => {
            const { type: TagComponent, attributes } = item

            const key = [
              attributes.type,
              attributes.rel,
              attributes.href || attributes['data-href'],
            ].join('-')
            const props = Object.assign({ key }, item.attributes)
            return <TagComponent {...props} />
          })

      if (injectHeadIsNotFound) {
        console.warn(
          'Please provide injectHead component to render links tag in head!',
        )
        console.warn(
          'Suggestion: use `next/head` for Next.js or `react-helmet` for creact-react-app',
        )

        if (!DOMHelpers.domIsExsted) {
          return null
        }

        // tslint:disable-next-line: semicolon
        ;(tags as DOMHelpers.DefinedElement[]).forEach((item) => {
          const tagElement = DOMHelpers.createElement(item)
          DOMHelpers.appendToHead(tagElement)
        })

        return null
      }

      // @ts-ignore
      return <InjectHead>{tags}</InjectHead>
    }, [])

    return (
      <Component {...rest} id="main">
        {head}
        {children}
      </Component>
    )
  }

  const injectReact = factoryInjectReact({ React, ReactDOM })
  if (autoInject) {
    injectReact()
  }

  return { App, injectReact }
}

export default reactHelpersFactory
