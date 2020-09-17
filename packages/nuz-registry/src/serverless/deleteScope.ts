import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'deleteScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/scope',
    wrapRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { scope } = request.body

      if (!token || !scope) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.deleteScope(token as string, scope)

      //
      response.json(result)

      return true
    }),
  )
}
