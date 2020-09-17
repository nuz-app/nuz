import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'getScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/scope',
    wrapRoute(async function (request, response) {
      const { scope: id, fields } = request.query

      if (!id) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.getScope(id as string, fields)

      //
      response.json({ scope: result })

      return true
    }),
  )
}
