import fs from 'fs'
import path from 'path'

const loadCertificateDefault = () => ({
  key: fs.readFileSync(path.join(__dirname, '../../keys/https/private.key')),
  cert: fs.readFileSync(
    path.join(__dirname, '../../keys/https/certificate.crt'),
  ),
})

export default loadCertificateDefault
