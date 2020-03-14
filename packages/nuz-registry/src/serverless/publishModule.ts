import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export const name = 'publishModule'

export const execute = (app: Express, db: ModelDB, options) => {
  app.post(
    '/module',
    onRoute(async (request, response) => {
      const { token, info, options: publishOptions } = request.body
      const item = await db.publishModule(token, info, publishOptions)

      response.json(item)
      return true
    }),
  )
}
