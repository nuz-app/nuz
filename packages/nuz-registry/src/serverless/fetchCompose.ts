import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'fetchCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/fetch/compose',
    onRoute(async (request, response) => {
      const { compose } = request.query

      const formIsMissing = !compose
      if (formIsMissing) {
        throw new Error('Missing compose id to fetch data')
      }
      
      const item = await worker.fetchCompose(compose as string)
      response.json(item)
      return true
    }),
  )
}
