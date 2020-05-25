function ensureDependendies(deps: any) {
  const dependencies = {} as any

  dependencies.react = deps.react
  if (!dependencies.react) {
    try {
      dependencies.react = require('react')
      // tslint:disable-next-line: no-empty
    } catch {}
  }

  dependencies['react-dom'] = deps['react-dom']
  if (!dependencies['react-dom']) {
    try {
      dependencies['react-dom'] = require('react-dom')
      // tslint:disable-next-line: no-empty
    } catch {}
  }

  return dependencies
}

export default ensureDependendies
