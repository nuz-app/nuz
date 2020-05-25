import { REACT_DOM_INJECTED } from '@nuz/shared'

import * as bootstrap from '../../bootstrap'

function inject(React: any, ReactDOM: any): void {
  if (!ReactDOM) {
    throw new Error('No `react-dom` dependency found, please provide to use')
  }

  if (ReactDOM[REACT_DOM_INJECTED]) {
    return
  }

  const renderOriginal = ReactDOM.render.bind(ReactDOM)
  const hydrateOriginal = ReactDOM.hydrate.bind(ReactDOM)

  const renderFactory = (fn: any) =>
    async function renderInjected(
      element: JSX.Element,
      container: Element,
      callback?: () => any,
    ) {
      await bootstrap.process.ready()

      return fn(element, container, callback)
    }

  Object.assign(ReactDOM, {
    render: renderFactory(renderOriginal),
    hydrate: renderFactory(hydrateOriginal),
  })

  Object.defineProperty(ReactDOM, REACT_DOM_INJECTED, { value: true })
}

export default inject
