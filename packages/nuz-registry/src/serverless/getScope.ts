import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/scope',
    onRoute(async (request, response) => {
      const { scope: id, fields } = request.query

      const formIsMissing = !id
      if (formIsMissing) {
        throw new Error('Missing scope id')
      }
      const item = await worker.getScope(id as string, fields)

      response.json({ scope: item })
      return true
    }),
  )
}
