import { TObjectId } from '../types'

const compareObjectId = (id1: TObjectId, id2: TObjectId) => id1.equals(id2)

export default compareObjectId
