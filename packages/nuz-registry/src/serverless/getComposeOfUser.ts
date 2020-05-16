import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getComposeOfUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/user/composes',
    onRoute(async (request, response) => {
      const { user: id } = request.query

      const formIsMissing = !id
      if (formIsMissing) {
        throw new Error('Missing user id to get the composes')
      }
      const result = await worker.getComposeOfUser(id as string)

      response.json({ user: id, composes: result })
      return true
    }),
  )
}
