import { checkIsProductionMode, loadCertificateDefault } from '@nuz/utils'
import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import http from 'http'
import spdy from 'spdy'

import Cache from './classes/Cache'
import Worker from './classes/Worker'
import serverless from './serverless'
import { ServerOptions, ServerlessOptions, StorageTypes } from './types'

class Server {
  private readonly _dev: boolean
  private readonly _worker: Worker
  private readonly _cache: Cache
  private readonly _static: string | null
  private readonly _storageType: StorageTypes
  private readonly _storage: any
  private readonly _app: express.Express
  private readonly _server: http.Server
  private readonly _serverless: ServerlessOptions

  constructor(options: ServerOptions) {
    const {
      dev,
      cache,
      https,
      db,
      compression: compress = true,
      storageType,
      storage,
      static: staticOrigin,
    } = options

    this._cache = cache
    this._storage = storage
    this._storageType =
      storageType || this._storage ? StorageTypes.provided : StorageTypes.self
    this._static =
      this._storageType === StorageTypes.self ? null : (staticOrigin as string)
    this._dev = typeof dev === 'boolean' ? dev : !checkIsProductionMode()

    const storageIsRequired =
      storageType === StorageTypes.provided || storageType === StorageTypes.full
    const storageIsMissing = storageIsRequired && !this._storage
    if (storageIsMissing) {
      throw new Error('Storage is required in full or provided mode')
    }

    const staticIsMissing = storageIsRequired && !this._static
    if (staticIsMissing) {
      throw new Error('')
    }

    this._worker = new Worker(db, {
      cache: this._cache,
      storageType: this._storageType,
      storage: this._storage,
      static: this._static,
    })

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
        Object.assign(
          { dev: this._dev },
          (this._serverless as any)[route.name],
        ),
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
