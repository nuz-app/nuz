import fs from 'fs'
import path from 'path'

import generateLocalCertificate from './generateLocalCertificate'

const DEFAULT_ENCODING = 'utf8'

const paths = {
  dir: path.join(__dirname, '../keys/https'),
  pem: path.join(__dirname, '../keys/https/server.pem'),
}

function loadLocalCertificate(): {
  key: Buffer
  cert: Buffer
} {
  let certificateIsExisted = fs.existsSync(paths.pem)

  if (certificateIsExisted) {
    const ttl = 1000 * 60 * 60 * 24
    const now = new Date()
    const certificateStat = fs.statSync(paths.pem)

    // @ts-ignore
    const createdDate = now - certificateStat.ctime
    if (createdDate / ttl > 30) {
      certificateIsExisted = false
      fs.unlinkSync(paths.pem)
    }
  }

  const shouldEmptyDir = !fs.existsSync(paths.pem)
  if (shouldEmptyDir) {
    const attributes = [{ name: 'commonName', value: 'localhost' }]
    const pems = generateLocalCertificate(attributes)

    fs.writeFileSync(paths.pem, pems.private + pems.cert, {
      encoding: DEFAULT_ENCODING,
    })
  }

  const certificate = fs.readFileSync(paths.pem)

  return {
    key: certificate,
    cert: certificate,
  }
}

export default loadLocalCertificate
