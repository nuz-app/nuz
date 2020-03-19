import objectHash from 'object-hash'

export const moduleId = (config: any) =>
  objectHash(config, { ignoreUnknown: true })
