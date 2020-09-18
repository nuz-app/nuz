import { checkIsProductionMode } from '@nuz/utils'
import bodyParser from 'body-parser'
import express from 'express'
import http from 'http'

import Cache from './classes/Cache'
import Storage from './classes/Storage'
import Worker from './classes/Worker'
import serverless from './serverless'
import { ServerOptions, ServerlessOptions, StorageTypes } from './types'
import createServerForApplication from './utils/createServerForApplication'

class Server {
  /**
   * Is development mode
   */
  private readonly dev: boolean

  /**
   * Is Worker
   */
  private readonly worker: Worker

  /**
   * The cache resolver
   */
  private readonly cacheResolver: Cache

  /**
   * CDN information
   */
  private readonly cdn: string | null

  /**
   * Storage type
   */
  private readonly storageType: StorageTypes

  /**
   * Storage instance
   */
  private readonly storageInstance: Storage

  /**
   * The application
   */
  private readonly app: express.Express

  /**
   * Is http(s) server instance
   */
  private readonly server: http.Server

  /**
   * Serverless information
   */
  private readonly serverless: ServerlessOptions

  constructor(options: ServerOptions) {
    const { dev, cache, https, db, storage, cdn } = Object.assign(
      { compression: true },
      options,
    )

    // Set common information
    this.dev = typeof dev === 'boolean' ? dev : !checkIsProductionMode()

    // Retained if the system uses cache resolver.
    this.cacheResolver = cache

    // Configure and set up storage.
    this.storageInstance = storage.worker
    this.storageType =
      storage.type ||
      (this.storageInstance ? StorageTypes.provided : StorageTypes.self)

    // Based on the storage type used will set the CDN information.
    this.cdn = this.storageType === StorageTypes.self ? null : (cdn as string)

    // Make sure the storage configuration is correct.
    if (storage?.type === StorageTypes.provided && !this.storageInstance) {
      throw new Error(
        'Storage configuration is incorrect because there is missing worker for storage.',
      )
    }

    // Create the worker to start work.
    this.worker = new Worker(db, {
      cache: this.cacheResolver,
      storage: {
        type: this.storageType,
        worker: this.storageInstance,
      },
      // @ts-expect-error
      cdn: this.cdn,
    })

    // Create the application.
    this.app = express()

    // Create server for the application
    this.server = createServerForApplication(this.app, https as any)

    // Serverless information
    this.serverless = Object.assign({}, options.serverless)
  }

  async middlewares(
    caller: (app: express.Express) => Promise<any>,
  ): Promise<any> {
    return caller(this.app)
  }

  async prepare(): Promise<void> {
    // Wait for the worker and the cache resolver to finish preparing.
    await Promise.all(
      [this.cacheResolver?.prepare(), this.worker.prepare()].filter(Boolean),
    )

    // Basic security configuration for the application.
    this.app.disable('x-powered-by')
    this.app.enable('trust proxy')
    this.app.enable('strict routing')

    // Configure the middleware to parse the requests.
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())

    // Registering routes for the application.
    for (const route of serverless) {
      route.execute(
        this.app,
        this.worker,
        Object.assign({ dev: this.dev }, (this.serverless as any)[route.name]),
      )
    }
  }

  async listen(port: number): Promise<void> {
    this.server.listen(port, () =>
      console.log(`Registry server listening on port ${port}.`),
    )
  }
}

export default Server
