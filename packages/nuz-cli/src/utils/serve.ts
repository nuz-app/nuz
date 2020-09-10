import { loadLocalCertificate } from '@nuz/utils'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import http from 'http'
import handler from 'serve-handler'
import spdy from 'spdy'

import { ServeConfiguration } from '../types'

export interface ServeFullConfig extends ServeConfiguration {
  port: number
  directory: string
}

function serve(config: ServeFullConfig): any {
  const { port, directory, https } = config

  let server

  const app = express()
  //
  app.disable('x-powered-by')
  app.use(compression())
  app.use(cors())

  //
  app.use((request, response) =>
    handler(request, response, {
      public: directory,
      symlinks: true,
      etag: true,
    }),
  )

  //
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
