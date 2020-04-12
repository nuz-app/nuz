import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'createUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/user',
    onRoute(async (request, response) => {
      const { token, data } = request.body

      const item = await worker.updateUser(token, data)

      response.json(item)
      return true
    }),
  )
}
