import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'deprecateModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/module/deprecate',
    onRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { module: id, version, deprecate } = request.body

      if (!token || !id || !version) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.deprecateModule(
        token as string,
        id,
        version,
        deprecate,
      )

      //
      response.json(result)

      return true
    }),
  )
}
