import { Express } from 'express'

import Worker from '../classes/Worker'

import onRoute from '../utils/onRoute'

export const name = 'deleteToken'

export const execute = (app: Express, worker: Worker) => {
  app.delete(
    '/token',
    onRoute(async (request, response) => {
      const { authorization } = request.headers
      const { token } = request.body

      const item = await worker.deleteToken(authorization, token)

      response.json(item)
      return true
    }),
  )
}
