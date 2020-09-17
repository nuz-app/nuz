import { TObjectId } from '../types'

function compareObjectId(a: TObjectId, b: TObjectId): boolean {
  return a.equals(b)
}

export default compareObjectId
