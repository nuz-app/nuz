import { Express } from 'express'

import Worker from '../classes/Worker'

import onRoute from '../utils/onRoute'

export const name = 'health'

export const execute = (app: Express, worker: Worker) => {
  app.get(
    '/health',
    onRoute(async (request, response) => {
      response.status(200).json({ isOk: true })
      return true
    }),
  )
}
