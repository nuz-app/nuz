import { Express } from 'express'

import ModelDB from '../classes/ModelDB'

import onRoute from '../utils/onRoute'

export const name = 'health'

export const execute = (app: Express, db: ModelDB, options) => {
  app.get(
    '/health',
    onRoute(async (request, response) => {
      response.status(200).json({ isOk: true })
      return true
    }),
  )
}
