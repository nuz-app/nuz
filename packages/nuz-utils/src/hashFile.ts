import crypto from 'crypto'
import fs from 'fs'

function hashFile(path: string, hash: string): string {
  return crypto.createHash(hash).update(fs.readFileSync(path)).digest('hex')
}

export default hashFile
