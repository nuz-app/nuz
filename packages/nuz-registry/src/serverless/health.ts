import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'health'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/health',
    onRoute(async function (request, response) {
      //
      response.status(200).json({ isOk: true })

      return true
    }),
  )
}
