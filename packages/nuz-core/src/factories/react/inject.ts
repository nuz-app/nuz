import { REACT_DOM_INJECTED } from '@nuz/shared'

import * as shared from '../../shared'

import Loadable from './Loadable'

export interface ReactInjectDependencies {
  'react-dom': any
}

function inject(dependencies: ReactInjectDependencies): boolean {
  const ReactDOM = dependencies['react-dom']
  if (!ReactDOM) {
    throw new Error('Cannot find `react-dom` to inject')
  }

  if (ReactDOM[REACT_DOM_INJECTED]) {
    return true
  }

  const renderOriginal = ReactDOM.render.bind(ReactDOM)
  const hydrateOriginal = ReactDOM.hydrate.bind(ReactDOM)

  function handlerFactory(fn: any) {
    return async function handlerInjected(
      element: JSX.Element,
      container: Element,
      callback?: () => any,
    ) {
      await Promise.all([shared.process.isReady(), Loadable.readyAll()])

      return fn(element, container, callback)
    }
  }

  Object.assign(ReactDOM, {
    render: handlerFactory(renderOriginal),
    hydrate: handlerFactory(hydrateOriginal),
  })

  Object.defineProperty(ReactDOM, REACT_DOM_INJECTED, { value: true })

  return true
}

export default inject
