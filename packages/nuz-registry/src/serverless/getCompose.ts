import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/compose',
    onRoute(async (request, response) => {
      const { compose: id, fields } = request.query

      const formIsMissing = !id
      if (formIsMissing) {
        throw new Error('Missing compose id')
      }
      const item = await worker.getCompose(id as string, fields)

      response.json({ compose: item })
      return true
    }),
  )
}
