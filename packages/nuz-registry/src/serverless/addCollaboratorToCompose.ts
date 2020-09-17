import { Express } from 'express'

import Worker from '../classes/Worker'
import { CollaboratorTypes } from '../types'
import * as collaboratorTypeHelpers from '../utils/collaboratorTypeHelpers'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'addCollaboratorToCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/compose/collaborator',
    wrapRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { compose, collaborator } = request.body

      if (!token || !compose || !collaborator) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      if (
        !collaboratorTypeHelpers.validate(collaborator.type) ||
        !collaborator.id
      ) {
        throw new Error('Incorrect collaborator information required.')
      }

      //
      const result = await worker.addCollaboratorToCompose(
        token as string,
        compose,
        {
          id: collaborator.id,
          type: collaborator.type as CollaboratorTypes,
        },
      )

      //
      response.json(result)

      return true
    }),
  )
}
