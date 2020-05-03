import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/composition',
    onRoute(async (request, response) => {
      const { composition: id, fields } = request.query

      const formIsMissing = !id
      if (formIsMissing) {
        throw new Error('Missing composition id')
      }
      const item = await worker.getComposition(id as string, fields)

      response.json({ composition: item })
      return true
    }),
  )
}
