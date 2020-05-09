import hashFile from './hashFile'

const compareFilesByHash = (a: string, b: string, hash: string = 'md5') =>
  hashFile(a, hash) === hashFile(b, hash)

export default compareFilesByHash
