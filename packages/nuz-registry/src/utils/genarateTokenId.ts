import { customAlphabet } from 'nanoid'

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'

const id = customAlphabet(ALPHABET, 4)
const random = customAlphabet(ALPHABET, 10)

const genarateTokenId = () => id() + '-' + random() + '-' + id()

export default genarateTokenId
