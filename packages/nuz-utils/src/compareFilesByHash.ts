import hashFile from './hashFile'

function compareFilesByHash(
  a: string,
  b: string,
  hash: string = 'md5',
): boolean {
  return hashFile(a, hash) === hashFile(b, hash)
}

export default compareFilesByHash
