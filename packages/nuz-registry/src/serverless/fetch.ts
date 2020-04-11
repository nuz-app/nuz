import { Express } from 'express'

import { FetchRouteOptions } from '../types'

import Worker from '../classes/Worker'

import hardCacheOnTime from '../utils/hardCacheOnTime'
import onRoute from '../utils/onRoute'

const CACHE_KEY = Symbol.for('serverless.fetch')

export const name = 'fetch'

export const execute = (
  app: Express,
  worker: Worker,
  options: FetchRouteOptions,
) => {
  app.get(
    '/',
    onRoute(async (request, response) => {
      const { cacheTime, prepareTime } = options

      const config = await hardCacheOnTime(
        () => worker.getConfig(),
        CACHE_KEY,
        cacheTime,
        prepareTime,
      )

      response.json(config)
      return true
    }),
  )
}
