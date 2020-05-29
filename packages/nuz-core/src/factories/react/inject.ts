import { REACT_DOM_INJECTED } from '@nuz/shared'

import * as shared from '../../shared'

import Loadable from './Loadable'

function inject(deps): void {
  const dom = deps['react-dom']
  if (!dom) {
    throw new Error('No `react-dom` dependency found, please provide to use')
  }

  if (dom[REACT_DOM_INJECTED]) {
    return
  }

  const renderOriginal = dom.render.bind(dom)
  const hydrateOriginal = dom.hydrate.bind(dom)

  const renderFactory = (fn: any) =>
    async function renderInjected(
      element: JSX.Element,
      container: Element,
      callback?: () => any,
    ) {
      await Promise.all([shared.process.ready(), Loadable.readyAll()])

      return fn(element, container, callback)
    }

  Object.assign(dom, {
    render: renderFactory(renderOriginal),
    hydrate: renderFactory(hydrateOriginal),
  })

  Object.defineProperty(dom, REACT_DOM_INJECTED, { value: true })
}

export default inject
