import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'setTagModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/module/tag',
    wrapRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { module: id, version, tag } = request.body

      if (!token || !id || !version || !tag) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.setTagModule(
        token as string,
        id,
        version,
        tag,
      )

      //
      response.json(result)

      return true
    }),
  )
}
