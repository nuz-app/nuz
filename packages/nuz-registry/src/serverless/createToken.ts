import { Express } from 'express'

import Worker from '../classes/Worker'

import onRoute from '../utils/onRoute'

export const name = 'createToken'

export const execute = (app: Express, worker: Worker) => {
  app.post(
    '/token',
    onRoute(async (request, response) => {
      const { authorization } = request.headers
      const { scope } = request.body

      const item = await worker.createToken(authorization, scope)

      response.json(item)
      return true
    }),
  )
}
