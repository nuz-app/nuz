import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getCompositionsOfUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/user/compositions',
    onRoute(async (request, response) => {
      const { user: id } = request.query

      const formIsMissing = !id
      if (formIsMissing) {
        throw new Error('Missing user id to get the compositions')
      }
      const result = await worker.getCompositionsOfUser(id as string)

      response.json({ user: id, compositions: result })
      return true
    }),
  )
}
