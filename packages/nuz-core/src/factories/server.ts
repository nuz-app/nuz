import * as shared from '../shared'

import * as extractorHelpers from './react/extractorHelpers'
import inject from './react/inject'
import Loadable from './react/Loadable'

type Hook = () => Promise<any>

function callOrNoop<T extends any>(caller: any): Promise<T> {
  return typeof caller === 'function' ? caller() : Promise.resolve()
}

export async function prepare(): Promise<void> {
  inject({
    // @ts-expect-error
    react: require('react'),
    'react-dom': require('react-dom'),
  })

  shared.extractor.prepare({
    parser: extractorHelpers.parser,
    renderer: extractorHelpers.renderer,
  })
}

export async function setup(other?: Hook): Promise<any> {
  await Promise.all([
    shared.process.isReady(),
    shared.extractor.setup(),
    Loadable.preloadAll(),
    callOrNoop(other),
  ])
}

export async function teardown(other?: Hook, updater?: Hook): Promise<any> {
  await Promise.all([
    shared.extractor.teardown(),
    shared.process.checkUpdate(() =>
      Promise.all([Loadable.flushAll(), callOrNoop(updater)]),
    ),
    callOrNoop(other),
  ])
}
