import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'deleteComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/composition',
    onRoute(async (request, response) => {
      const { token, name: compositionName } = request.body

      const item = await worker.deleteComposition(token, compositionName)

      response.json(item)
      return true
    }),
  )
}
