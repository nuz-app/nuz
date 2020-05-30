import { DefinedElement } from '../DOMHelpers'
import getModules from './getModules'

function getElementsInHead(resolvedIds?: string[]): DefinedElement[] {
  return getModules().getElementsInHead(resolvedIds)
}

export default getElementsInHead
