import { checkIsProductionMode, loadCertificateDefault } from '@nuz/utils'

import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import http from 'http'
import spdy from 'spdy'

import { ServerlessOptions, ServerOptions } from './types'

import Cache from './classes/Cache'
import Worker from './classes/Worker'

import serverless from './serverless'

class Server {
  private readonly _dev: boolean
  private readonly _worker: Worker
  private readonly _cache: Cache
  private readonly _app: express.Express
  private readonly _server: http.Server
  private readonly _serverless: ServerlessOptions

  constructor(options: ServerOptions) {
    const { dev, cache, https, db, compression: compress = true } = options

    this._cache = cache
    this._dev = typeof dev === 'boolean' ? dev : !checkIsProductionMode()
    this._worker = new Worker(db, this._cache)

    // Init app to listen requests
    this._app = express()

    // Check if using secure connection
    if (https) {
      const httpsConfig =
        https === true ? Object.assign({}, loadCertificateDefault()) : https
      this._server = spdy.createServer(httpsConfig, this._app)
    } else {
      this._server = http.createServer(this._app)
    }

    if (compress) {
      const compressionConfig = compress === true ? {} : compress
      this._app.use(compression(compressionConfig))
    }

    // Set serverless config
    this._serverless = options.serverless || {}
  }

  async middlewares(fn: (app: express.Express) => Promise<any>) {
    return fn(this._app)
  }

  async prepare() {
    const promises = [this._cache?.prepare(), this._worker.prepare()].filter(
      Boolean,
    )
    await Promise.all(promises)

    this._app.disable('x-powered-by')
    this._app.enable('trust proxy')
    this._app.enable('strict routing')

    this._app.use(bodyParser.urlencoded({ extended: false }))
    this._app.use(bodyParser.json())

    for (const route of serverless) {
      route.execute(
        this._app,
        this._worker,
        (this._serverless as any)[route.name] || {},
      )
    }
  }

  async listen(port: number) {
    this._server.listen(port, () =>
      console.log(`Registry server listening on port ${port}!`),
    )
  }
}

export default Server
