import { Express } from 'express'

import Worker from '../classes/Worker'

import onRoute from '../utils/onRoute'

export const name = 'publishModule'

export const execute = (app: Express, worker: Worker) => {
  app.post(
    '/module',
    onRoute(async (request, response) => {
      const { token, info, options: publishOptions } = request.body
      const item = await worker.publishModule(token, info, publishOptions)

      response.json(item)
      return true
    }),
  )
}
