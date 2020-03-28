import { REACT_DOM_INJECTED } from '@nuz/shared'

import checkIsReady from './checkIsReady'
import getTagsInHead from './getTagsInHead'

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
          'Suggestion: use `next/head` for next.js or `helmet` for creact-react-app',
        )

        if (!DOMHelpers.domIsExsted) {
          return null
        }

        // tslint:disable-next-line: semicolon
        ;(headTags as DOMHelpers.DefinedElement[]).forEach((item) => {
          const tagElement = DOMHelpers.createElement(item)
          DOMHelpers.appendToHead(tagElement)
        })
        console.log({ headTags })

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

  const originalRender = ReactDOM.render
  const originalHydrate = ReactDOM.hydrate

  const injectReact = () => {
    if (ReactDOM[REACT_DOM_INJECTED]) {
      return false
    }

    Object.assign(ReactDOM, {
      render: async (...rest) => {
        await checkIsReady()
        return originalRender.apply(ReactDOM, rest as any)
      },
      hydrate: async (...rest) => {
        await checkIsReady()
        return originalHydrate.apply(ReactDOM, rest as any)
      },
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
