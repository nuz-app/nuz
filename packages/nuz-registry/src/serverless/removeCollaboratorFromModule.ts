import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'removeCollaboratorFromModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/module/collaborator',
    wrapRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { module: id, collaboratorId } = request.body

      if (!token || !id || !collaboratorId) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.removeCollaboratorFromModule(
        token as string,
        id,
        collaboratorId,
      )

      //
      response.json(result)

      return true
    }),
  )
}
