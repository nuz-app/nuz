import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getScopesOfUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/user/scopes',
    onRoute(async (request, response) => {
      const { user: id } = request.body

      const formIsMissing = !id
      if (formIsMissing) {
        throw new Error('Missing user id to get the scopes')
      }
      const item = await worker.getScopesOfUser(id)

      response.json(item)
      return true
    }),
  )
}
