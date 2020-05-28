import getModules from './utils/effects/getModules'

function getElementsInHead(resolvedIds?: string[]) {
  return getModules().getElementsInHead(resolvedIds)
}

export default getElementsInHead
