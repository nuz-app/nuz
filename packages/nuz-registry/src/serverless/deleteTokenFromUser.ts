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

      const formIsMissing = !id || !token
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.deleteTokenFromUser(ensureObjectId(id), token)

      response.json(item)
      return true
    }),
  )
}
