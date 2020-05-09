import crypto from 'crypto'
import fs from 'fs'

const hashFile = (path: string, hash: string) =>
  crypto.createHash(hash).update(fs.readFileSync(path)).digest('hex')

export default hashFile
