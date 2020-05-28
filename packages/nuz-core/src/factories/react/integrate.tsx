import React from 'react'

import ensureDependendies from './ensureDependencies'
import inject from './inject'

export interface ReactAppProps extends React.PropsWithChildren<any> {
  component?: React.ElementType
  injectHead?: React.ElementType
}

export interface ReactFactoryDependencies {
  react: any
  'react-dom': any
}

function integrate(deps: Partial<ReactFactoryDependencies> = {}) {
  const dependencies = ensureDependendies(deps)
  inject(dependencies)
}

export default integrate
