import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export const name = 'setScope'

export const execute = (app: Express, db: ModelDB, options) => {
  app.post(
    '/permission/scope',
    onRoute(async (request, response) => {
      const { authorization } = request.headers
      const { token, scope } = request.body

      const item = await db.setScope(authorization, token, scope)

      response.json(item)
      return true
    }),
  )
}
