import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export const name = 'rollbackModule'

export const execute = (app: Express, db: ModelDB, options) => {
  app.put(
    '/module/rollback',
    onRoute(async (request, response) => {
      const { token, name: _name, upstream, fallback } = request.body
      const item = await db.rollbackModule(token, {
        name: _name,
        upstream,
        fallback,
      })

      response.json(item)
      return true
    }),
  )
}
