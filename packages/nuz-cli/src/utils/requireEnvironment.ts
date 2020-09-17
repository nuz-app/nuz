export interface ParsedEnvironment {
  strict: boolean
  raw: any
  port: number
  generateSourceMap: boolean
  host: string
  babelEnv: 'development' | 'production'
  nodeEnv: 'development' | 'production'
  inlineSizeLimit: number
  analyzer: boolean
  measure: boolean
  cache: boolean
  multiThread: boolean
}

let environment: any

function requireEnvironment(dev: boolean): ParsedEnvironment {
  if (!environment) {
    const port = parseInt(process.env.PORT as string, 10) || 3000
    const host = process.env.HOST ?? '0.0.0.0'
    const generateSourceMap = process.env.GENERATE_SOURCEMAP === 'true' // default is `false`
    const babelEnv = (process.env.BABEL_ENV ?? '').toLowerCase() as any
    const nodeEnv = (process.env.NODE_ENV ?? '').toLowerCase() as any
    const analyzer = process.env.ANALYZER === 'true' // default is `false`
    const measure = process.env.MEASURE !== 'false' // default is `true`
    const cache =
      nodeEnv === 'development'
        ? process.env.CACHE !== 'false' // default is `true` for development mode
        : process.env.CACHE === 'true' // default is `false` for other mode
    const multiThread = process.env.MULTI_THREAD !== 'false' // default is `true`
    const strict = process.env.STRICT !== 'false' // default is `true`

    const inlineSizeLimit = parseInt(
      process.env.STATIC_INLINE_SIZE_LIMIT ?? '5120',
      10,
    )

    const rawAsKeys = Object.keys(process.env)
    const raw = rawAsKeys.reduce(
      (acc, key) =>
        Object.assign(acc, { [`process.env.${key}`]: process.env[key] }),
      {},
    )

    environment = {
      strict,
      raw,
      port,
      generateSourceMap,
      host,
      babelEnv,
      nodeEnv,
      inlineSizeLimit,
      analyzer,
      measure,
      cache,
      multiThread,
    }
  }

  return environment
}

export default requireEnvironment
