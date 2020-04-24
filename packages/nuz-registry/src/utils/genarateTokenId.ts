import { customAlphabet } from 'nanoid'

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'

const random = customAlphabet(ALPHABET, 24)

const genarateTokenId = random

export default genarateTokenId
