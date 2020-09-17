import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'root'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/',
    wrapRoute(async function (request, response) {
      //
      response
        .status(200)
        .json({ _: 'The registry server of Nuz. Welcome to Nuz project.' })

      return true
    }),
  )
}
