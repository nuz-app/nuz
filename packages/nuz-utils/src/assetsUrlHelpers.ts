export const parse = (value: string) => {
  const url = new URL(value)

  const paths = url.pathname.split('/-/')
  if (!paths[1]) {
    throw new Error('URL is invalid')
  }

  const moduleId = paths[0].replace(/^\//, '')
  // @ts-ignore
  const [, version, file] = paths[1].match(/^([^\/]+)\/([\s\S]+)$/i)

  return {
    url,
    paths,
    moduleId,
    version,
    file,
  }
}

export const create = (
  moduleId: string,
  version: string,
  file: string,
  domain: string,
) => `https://${domain}/${moduleId}/-/${version}/${file}`
