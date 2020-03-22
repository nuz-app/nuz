import { loadCertificateDefault } from '@nuz/utils'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import http from 'http'
import handler from 'serve-handler'
import spdy from 'spdy'

import { ServeConfig } from '../types'

import checkIsProductionMode from './checkIsProductionMode'

export type ServeFullConfig = ServeConfig & {
  port: number
  dir: string
}

const defaultConfig: ServeConfig = {
  hidePoweredBy: true,
  cors: checkIsProductionMode() ? false : true,
  compression: checkIsProductionMode() ? false : true,
}

const serve = (config: ServeFullConfig) => {
  const {
    port,
    dir,
    https,
    hidePoweredBy,
    compression: compress,
    cors: corsc,
  } = Object.assign({}, defaultConfig, config)

  let server

  const app = express()

  if (hidePoweredBy) {
    app.disable('x-powered-by')
  }

  if (compress) {
    app.use(compression(compress === true ? {} : compress))
  }

  if (corsc) {
    app.use(cors(corsc === true ? {} : corsc))
  }

  app.use((request, response) =>
    handler(request, response, {
      public: dir,
      symlinks: true,
      etag: true,
    }),
  )

  if (https) {
    const httpsConfig =
      https === true ? Object.assign({}, loadCertificateDefault()) : https
    server = spdy.createServer(httpsConfig, app)
  } else {
    server = http.createServer(app)
  }

  return server.listen(port)
}

export default serve
