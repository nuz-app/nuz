import crypto from 'crypto'
import fs from 'fs'

import got from './got'

const DEFAULT_ALGORITHM = 'sha256'
const DEFAULT_TIMEOUT = 60000

export const file = (path: string, algorithm: string = DEFAULT_ALGORITHM) => {
  const content = fs.readFileSync(path)

  return data(content, algorithm)
}

export const data = (content, algorithm: string = DEFAULT_ALGORITHM) => {
  const digest = crypto
    .createHash(algorithm)
    .update(content)
    .digest('base64')

  return `${algorithm}-${digest}`
}

export const url = async (
  link: string,
  algorithm: string = DEFAULT_ALGORITHM,
) => {
  const response = await got({
    method: 'get',
    url: link,
    timeout: DEFAULT_TIMEOUT,
    responseType: 'arraybuffer',
    maxRedirects: 10,
  })

  if (!response.data) {
    return null
  }

  return data(response.data, algorithm)
}
