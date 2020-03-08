import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export const name = 'extendScope'

export const execute = (app: Express, db: ModelDB, options) => {
  app.put(
    '/permission/scope',
    onRoute(async (request, response) => {
      const { authorization } = request.headers
      const { token, scope } = request.body

      const item = await db.extendScope(authorization, token, scope)

      response.json(item)
      return true
    }),
  )
}
