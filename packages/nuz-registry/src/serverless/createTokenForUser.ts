import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'createUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/user/token',
    onRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { type } = request.body

      if (!token || !type) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.createTokenForUser(token as string, type)

      //
      response.json(result)

      return true
    }),
  )
}
