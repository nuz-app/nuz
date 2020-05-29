// @ts-ignore
import React = require('react')

import inject from './inject'

function integrate(deps = {} as any) {
  const dependencies = {
    react: deps.react,
    'react-dom': deps['react-dom'],
  } as any

  if (!dependencies.react) {
    try {
      dependencies.react = require('react')
      // tslint:disable-next-line: no-empty
    } catch {}
  }

  if (!dependencies['react-dom']) {
    try {
      dependencies['react-dom'] = require('react-dom')
      // tslint:disable-next-line: no-empty
    } catch {}
  }

  inject(dependencies)

  return dependencies
}

export default integrate
