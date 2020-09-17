import { Types } from 'mongoose'

function ensureObjectId(value: string) {
  return Types.ObjectId(value)
}

export default ensureObjectId
