import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export default (app: Express, db: ModelDB) => {
  app.post(
    '/module',
    onRoute(async (request, response) => {
      const { token, info } = request.body
      const item = await db.publishModule(token, info, {})

      response.json(item)
      return true
    }),
  )
}
