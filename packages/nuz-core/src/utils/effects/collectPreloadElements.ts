import { DefinedElement } from '../documentHelpers'

import getModules from './getModules'

function collectPreloadElements(resolvedIds?: string[]): DefinedElement[] {
  return getModules().getPreloadElements(resolvedIds)
}

export default collectPreloadElements
