import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export const name = 'removeScope'

export const execute = (app: Express, db: ModelDB, options) => {
  app.delete(
    '/permission/scope',
    onRoute(async (request, response) => {
      const { authorization } = request.headers
      const { token, scope } = request.body

      const item = await db.removeScope(authorization, token, scope)

      response.json(item)
      return true
    }),
  )
}
