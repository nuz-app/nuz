import * as shared from '../shared'

import * as extractorHelpers from './react/extractorHelpers'
import inject from './react/inject'
import Loadable from './react/Loadable'

type Hook = () => Promise<any>

export async function prepare() {
  inject({
    react: require('react'),
    'react-dom': require('react-dom'),
  })

  shared.extractor.prepare({
    parser: extractorHelpers.parser,
    renderer: extractorHelpers.renderer,
  })
}

export async function setup(other?: Hook) {
  await Promise.all([
    shared.process.ready(),
    shared.extractor.setup(),
    Loadable.preloadAll(),
    typeof other === 'function' ? other() : Promise.resolve(),
  ])
}

export async function teardown(other?: Hook, updater?: Hook) {
  await Promise.all([
    shared.process.closeSession(),
    shared.extractor.teardown(),
    shared.process.checkUpdate(() =>
      Promise.all([
        Loadable.flushAll(),
        typeof updater === 'function' ? updater() : Promise.resolve(),
      ]),
    ),
    typeof other === 'function' ? other() : Promise.resolve(),
  ])
}
