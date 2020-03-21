import crypto from 'crypto'
import fs from 'fs'

const hashFile = (path: string, hash: string) =>
  crypto
    .createHash(hash)
    .update(fs.readFileSync(path))
    .digest('hex')

const compareFilesByHash = (a: string, b: string, hash: string = 'md5') =>
  hashFile(a, hash) === hashFile(b, hash)

export default compareFilesByHash
