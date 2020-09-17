import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'health'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/health',
    wrapRoute(async function (request, response) {
      //
      response.status(200).json({ isOk: true })

      return true
    }),
  )
}
