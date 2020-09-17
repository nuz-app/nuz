import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getCollaboratorsOfScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/scope/collaborators',
    onRoute(async function (request, response) {
      const { scope } = request.query

      if (!scope) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.getCollaboratorsOfScope(scope as string)

      //
      response.json(result)

      return true
    }),
  )
}
