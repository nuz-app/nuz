import { Express } from 'express'

import Worker from '../classes/Worker'
import ensureObjectId from '../utils/ensureObjectId'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'createUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/user/token',
    onRoute(async (request, response) => {
      const { id, token } = request.body

      const item = await worker.deleteTokenForUser(ensureObjectId(id), token)

      response.json(item)
      return true
    }),
  )
}
