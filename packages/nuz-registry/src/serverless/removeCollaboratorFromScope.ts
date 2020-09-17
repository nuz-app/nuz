import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeCollaboratorFromScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/scope/collaborator',
    onRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { scope, collaboratorId } = request.body

      if (!token || !scope || !collaboratorId) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.removeCollaboratorFromScope(
        token as string,
        scope,
        collaboratorId,
      )

      //
      response.json(result)

      return true
    }),
  )
}
