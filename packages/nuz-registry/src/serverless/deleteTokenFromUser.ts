import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'createUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/user/token',
    onRoute(async function (request, response) {
      const { id, token } = request.body

      if (!id || !token) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.deleteTokenFromUser(id, token)

      //
      response.json(result)

      return true
    }),
  )
}
