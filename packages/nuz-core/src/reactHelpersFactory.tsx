import { REACT_DOM_INJECTED } from '@nuz/shared'

import getTagsInHead from './getTagsInHead'
import { wait as checkIsReady } from './waitToReady'

import * as DOMHelpers from './utils/DOMHelpers'

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
      'React fields in config is required to use "reactHelpersFactory" helper!',
    )
  }

  if (!ReactDOM) {
    throw new Error(
      'ReactDOM fields in config is required to use "reactHelpersFactory" helper!',
    )
  }

  const { useMemo } = React

  const App: React.FunctionComponent<AppProps> = ({
    component: Component = 'main',
    injectHead: InjectHead,
    children,
    ...rest
  }) => {
    const definedTags = getTagsInHead()
    const head = useMemo(() => {
      const injectHeadIsNotFound = !InjectHead
      const headTags = injectHeadIsNotFound
        ? definedTags
        : definedTags.map((item) => {
            const { type: TagComponent, attributes } = item

            const key = `${attributes.rel}-${attributes.href}`
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
        ;(headTags as DOMHelpers.DefinedElement[]).forEach((item) => {
          const tagElement = DOMHelpers.createElement(item)
          DOMHelpers.appendToHead(tagElement)
        })

        return null
      }

      // @ts-ignore
      return <InjectHead>{headTags}</InjectHead>
    }, [])

    return (
      <Component {...rest} id="main">
        {head}
        {children}
      </Component>
    )
  }

  const originalRender = ReactDOM.render.bind(ReactDOM)
  const originalHydrate = ReactDOM.hydrate.bind(ReactDOM)

  const injectReact = () => {
    if (ReactDOM[REACT_DOM_INJECTED]) {
      return false
    }

    const renderFactory = (fn: any) =>
      async function renderInjected(element, container, callback?) {
        await checkIsReady()

        return fn(element, container, callback)
      }

    Object.assign(ReactDOM, {
      render: renderFactory(originalRender),
      hydrate: renderFactory(originalHydrate),
    })

    Object.defineProperty(ReactDOM, REACT_DOM_INJECTED, { value: true })

    return true
  }

  if (autoInject) {
    injectReact()
  }

  return { App, injectReact }
}

export default reactHelpersFactory
