import inject from './inject'

export interface ReactIntegrateDependencies {
  react: any
  'react-dom': any
}

function integrate(
  dependencies: ReactIntegrateDependencies,
): ReactIntegrateDependencies {
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
