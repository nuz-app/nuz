import { loadCertificateDefault } from '@nuz/utils'

import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import http from 'http'
import spdy from 'spdy'

import { DBTypes, ServerlessOptions, ServerOptions } from './types'

import ModelDB from './classes/ModelDB'
import MongoDB from './classes/MongoDB'

import serverless from './serverless'

const dbMaps = {
  [DBTypes.mongodb]: MongoDB,
}

class Server {
  private readonly key: string
  private readonly db: ModelDB
  private readonly app: express.Express
  private readonly server: http.Server
  private readonly serverless: ServerlessOptions

  constructor(options: ServerOptions) {
    const { https, key, db, compression: compress = true } = options

    // Init db to manage config
    const Database = dbMaps[db.type]
    if (!Database) {
      throw new Error('Received type of db field is invalid!')
    }

    this.key = key
    this.db = new Database(this.key, db as any)

    // Init app to listen requests
    this.app = express()

    // Check if using secure connection
    if (https) {
      const httpsConfig =
        https === true ? Object.assign({}, loadCertificateDefault()) : https
      this.server = spdy.createServer(httpsConfig, this.app)
    } else {
      this.server = http.createServer(this.app)
    }

    if (compress) {
      const compressionConfig = compress === true ? {} : compress
      this.app.use(compression(compressionConfig))
    }

    // Set serverless config
    this.serverless = options.serverless || {}
  }

  async middlewares(fn: (app: express.Express) => Promise<any>) {
    return fn(this.app)
  }

  async prepare() {
    await this.db.prepage()

    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())

    for (const route of serverless) {
      route.execute(
        this.app,
        this.db,
        (this.serverless as any)[route.name] || {},
      )
    }
  }

  async listen(port: number) {
    this.server.listen(port, () =>
      console.log(`Registry server listening on port ${port}!`),
    )
  }
}

export default Server
