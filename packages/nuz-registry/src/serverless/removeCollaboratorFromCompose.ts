import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeCollaboratorFromCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/compose/collaborator',
    onRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { compose, collaboratorId } = request.body

      if (!token || !compose || !collaboratorId) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.removeCollaboratorFromCompose(
        token as string,
        compose,
        collaboratorId,
      )

      //
      response.json(result)

      return true
    }),
  )
}
