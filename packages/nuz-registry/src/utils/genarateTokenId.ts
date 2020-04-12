import { customAlphabet } from 'nanoid'

import { TObjectId } from '../types'

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'

const random = customAlphabet(ALPHABET, 21)

const genarateTokenId = (id: TObjectId) =>
  id.toHexString().substr(0, 6) + '-' + random()

export default genarateTokenId
