import bodyParser from 'body-parser'
import express, { Express } from 'express'

import { DBTypes, ServerlessOptions, ServerOptions } from './types'

import ModelDB from './classes/ModelDB'
import MongoDB from './classes/MongoDB'

import serverless from './serverless'

const dbMaps = {
  [DBTypes.mongodb]: MongoDB,
}

class Server {
  private readonly db: ModelDB
  private readonly app: Express
  private readonly serverless: ServerlessOptions

  constructor(options: ServerOptions) {
    const { key, db } = options

    // Init db to manage config
    const Database = dbMaps[db.type]
    if (!Database) {
      throw new Error('Received type of db field is invalid!')
    }

    this.db = new Database(key, db)

    // Init app to listen requests
    this.app = express()

    // Set serverless config
    this.serverless = options.serverless || {}
  }

  async middlewares(fn) {
    return fn(this.app)
  }

  async prepare() {
    await this.db.prepage()

    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())

    for (const route of serverless) {
      route.execute(this.app, this.db, this.serverless[route.name] || {})
    }
  }

  async listen(port: number) {
    this.app.listen(port, () =>
      console.log(`Registry server listening on port ${port}!`),
    )
  }
}

export default Server
