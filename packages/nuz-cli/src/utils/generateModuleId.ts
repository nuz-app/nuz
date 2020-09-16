import crypto from 'crypto'

function generateModuleId(name: string): string {
  return crypto.createHash('md4').update(name).digest('hex').substr(0, 4)
}

export default generateModuleId
