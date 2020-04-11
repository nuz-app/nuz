import { Express } from 'express'

import Worker from '../classes/Worker'

import onRoute from '../utils/onRoute'

export const name = 'extendScope'

export const execute = (app: Express, worker: Worker) => {
  app.put(
    '/permission/scope',
    onRoute(async (request, response) => {
      const { authorization } = request.headers
      const { token, scope } = request.body

      const item = await worker.extendScope(authorization, token, scope)

      response.json(item)
      return true
    }),
  )
}
