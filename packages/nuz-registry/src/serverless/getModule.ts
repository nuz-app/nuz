import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'getModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/module',
    wrapRoute(async function (request, response) {
      const { module: id, fields } = request.query

      if (!id) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.getModule(id as string, fields)

      //
      response.json({ module: result })

      return true
    }),
  )
}
