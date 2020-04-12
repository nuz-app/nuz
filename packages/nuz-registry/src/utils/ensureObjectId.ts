import { Types } from 'mongoose'

const ensureObjectId = (value: string) => Types.ObjectId(value)

export default ensureObjectId
