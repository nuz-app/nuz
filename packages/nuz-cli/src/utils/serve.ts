import { loadLocalCertificate } from '@nuz/utils'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import http from 'http'
import handler from 'serve-handler'
import spdy from 'spdy'

import { ServeConfig } from '../types'

export type ServeFullConfig = ServeConfig & {
  port: number
  dir: string
}

const defaultConfig: ServeConfig = {}

const serve = (config: ServeFullConfig) => {
  const { port, dir, https } = Object.assign({}, defaultConfig, config)

  let server

  const app = express()
  app.disable('x-powered-by')
  app.use(compression())
  app.use(cors())

  app.use((request, response) =>
    handler(request, response, {
      public: dir,
      symlinks: true,
      etag: true,
    }),
  )

  if (https) {
    const httpsConfig =
      https === true ? Object.assign({}, loadLocalCertificate()) : https
    server = spdy.createServer(httpsConfig, app)
  } else {
    server = http.createServer(app)
  }

  return server.listen(port)
}

export default serve
