import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'createScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/scope',
    onRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { data } = request.body

      if (!token || !data) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.createScope(token as string, data)

      //
      response.json(result)

      return true
    }),
  )
}
