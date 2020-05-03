import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'root'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/',
    onRoute(async (request, response) => {
      response
        .status(200)
        .json({ _: 'The registry server of Nuz. Welcome to Nuz ecosystem!' })
      return true
    }),
  )
}
