import { Express } from 'express'

import Worker from '../classes/Worker'

import onRoute from '../utils/onRoute'

export const name = 'removeScope'

export const execute = (app: Express, worker: Worker) => {
  app.delete(
    '/permission/scope',
    onRoute(async (request, response) => {
      const { authorization } = request.headers
      const { token, scope } = request.body

      const item = await worker.removeScope(authorization, token, scope)

      response.json(item)
      return true
    }),
  )
}
