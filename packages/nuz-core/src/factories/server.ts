import * as shared from '../shared'

import * as extractorHelpers from './react/extractorHelpers'
import inject from './react/inject'
import Loadable from './react/Loadable'

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

export async function setup() {
  await Promise.all([
    shared.process.ready(),
    shared.extractor.setup(),
    Loadable.preloadAll(),
  ])
}

export async function teardown() {
  await Promise.all([
    shared.process.closeSession(),
    shared.extractor.teardown(),
    shared.process.checkUpdate(() => Loadable.flushAll()),
  ])
}
