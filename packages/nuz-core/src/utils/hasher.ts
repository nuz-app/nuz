import objectHash from 'object-hash'

export const moduleId = config => objectHash(config, { ignoreUnknown: true })
