import crypto from 'crypto'
import fs from 'fs'

import got from './got'

const DEFAULT_ALGORITHM = 'sha384'
const DEFAULT_TIMEOUT = 60000

export function file(
  path: string,
  algorithm: string = DEFAULT_ALGORITHM,
): string {
  const content = fs.readFileSync(path)

  return data(content, algorithm)
}

export function data(
  content: any,
  algorithm: string = DEFAULT_ALGORITHM,
): string {
  const digest = crypto.createHash(algorithm).update(content).digest('base64')

  return `${algorithm}-${digest}`
}

export async function url(
  link: string,
  algorithm: string = DEFAULT_ALGORITHM,
): Promise<string | null> {
  const response = await got<any>({
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
