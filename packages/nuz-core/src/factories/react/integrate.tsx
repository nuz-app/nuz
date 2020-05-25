import getElementsInHead from '../../getElementsInHead'
import * as DOMHelpers from '../../utils/DOMHelpers'

import ensureDependendies from './ensureDependencies'
import inject from './inject'

export interface ReactAppProps {
  component?: React.ElementType
  injectHead?: React.ElementType
}

export interface ReactFactoryDependencies {
  react: any
  'react-dom': any
}

function integrate(deps: Partial<ReactFactoryDependencies> = {}) {
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
    const head = useMemo(function bindElementsInHead() {
      const definedElements = getElementsInHead() || []
      const injectHeadIsNotFound = !InjectHead
      const elements = injectHeadIsNotFound
        ? definedElements
        : definedElements.map((item) => {
            const { type: TagComponent, attributes } = item
            const { type, rel, href, 'data-href': dataHref } = attributes

            const key = `${type}:${rel}:${href || dataHref}`
            const props = Object.assign({ key }, item.attributes)

            return <TagComponent {...props} />
          })

      if (injectHeadIsNotFound) {
        console.warn(
          'Please provide `injectHead` component to render elements in head!',
        )
        console.warn(
          'Suggestion: use `next/head` for Next.js or `react-helmet` for creact-react-app',
        )

        if (!DOMHelpers.domIsExsted) {
          return null
        }

        // tslint:disable-next-line: semicolon
        ;(elements as DOMHelpers.DefinedElement[]).forEach((item) => {
          const tagElement = DOMHelpers.createElement(item)
          DOMHelpers.appendToHead(tagElement)
        })

        return null
      }

      // @ts-ignore
      return <InjectHead>{elements}</InjectHead>
    }, [])

    return (
      <Component {...rest} id="nuz-main">
        {head}
        {children}
      </Component>
    )
  }

  inject(React, ReactDOM)

  return { App }
}

export default integrate
