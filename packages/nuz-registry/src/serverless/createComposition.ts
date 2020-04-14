import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'createComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/composition',
    onRoute(async (request, response) => {
      const { token, data } = request.body

      const item = await worker.createComposition(token, data)

      response.json(item)
      return true
    }),
  )
}
