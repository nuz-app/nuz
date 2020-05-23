import { REACT_DOM_INJECTED } from '@nuz/shared'

import getTagsInHead from '../getTagsInHead'
import * as DOMHelpers from '../utils/DOMHelpers'
import * as waitToReady from '../waitToReady'

export interface ReactAppProps {
  component?: React.ElementType
  injectHead?: React.ElementType
}

export interface ReactFactoryDependencies {
  react: any
  'react-dom': any
}

function ensureDependendies(deps: Partial<ReactFactoryDependencies>) {
  const dependencies = {} as ReactFactoryDependencies

  dependencies.react = deps.react
  if (!dependencies.react) {
    try {
      dependencies.react = require('react')
      // tslint:disable-next-line: no-empty
    } catch {}
  }

  dependencies['react-dom'] = deps['react-dom']
  if (!dependencies['react-dom']) {
    try {
      dependencies['react-dom'] = require('react-dom')
      // tslint:disable-next-line: no-empty
    } catch {}
  }

  return dependencies
}

export function injectReactDOMFactory(
  ReactDOM: ReactFactoryDependencies['react-dom'],
): () => void {
  if (!ReactDOM) {
    throw new Error('No `react-dom` dependency found, please provide to use')
  }

  const renderOriginal = ReactDOM.render.bind(ReactDOM)
  const hydrateOriginal = ReactDOM.hydrate.bind(ReactDOM)

  return () => {
    if (ReactDOM[REACT_DOM_INJECTED]) {
      return false
    }

    const renderFactory = (fn: any) =>
      async function renderInjected(
        element: JSX.Element,
        container: Element,
        callback?: () => any,
      ) {
        await waitToReady.wait()

        return fn(element, container, callback)
      }

    Object.assign(ReactDOM, {
      render: renderFactory(renderOriginal),
      hydrate: renderFactory(hydrateOriginal),
    })

    Object.defineProperty(ReactDOM, REACT_DOM_INJECTED, { value: true })

    return true
  }
}

function reactHelpersFactory(deps: Partial<ReactFactoryDependencies> = {}) {
  const dependencies = ensureDependendies(deps)

  if (!dependencies.react) {
    throw new Error('No `react` dependency found, please provide to use')
  } else if (!dependencies['react-dom']) {
    throw new Error('No `react-dom` dependency found, please provide to use')
  }

  const { react: React, 'react-dom': ReactDOM } = dependencies

  const { useMemo } = React

  const App: React.FunctionComponent<ReactAppProps> = ({
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
          'Please provide `injectHead` component to render tags in head!',
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
      <Component {...rest} id="nuz-main">
        {head}
        {children}
      </Component>
    )
  }

  injectReactDOMFactory(ReactDOM)()

  return { App }
}

export default reactHelpersFactory
