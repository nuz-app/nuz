import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export default (app: Express, db: ModelDB) => {
  app.get(
    '/',
    onRoute(async (request, response) => {
      const config = await db.getConfig()

      response.json(config)
      return true
    }),
  )
}
