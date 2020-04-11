import { Express } from 'express'

import Worker from '../classes/Worker'

import onRoute from '../utils/onRoute'

export const name = 'rollbackModule'

export const execute = (app: Express, worker: Worker) => {
  app.put(
    '/module/rollback',
    onRoute(async (request, response) => {
      const { token, name: _name, upstream, fallback } = request.body
      const item = await worker.rollbackModule(token, {
        name: _name,
        upstream,
        fallback,
      })

      response.json(item)
      return true
    }),
  )
}
