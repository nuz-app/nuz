import { Express } from 'express'

import Worker from '../classes/Worker'
import { CollaboratorTypes } from '../types'
import * as collaboratorTypeHelpers from '../utils/collaboratorTypeHelpers'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'updateCollaboratorOfScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/scope/collaborator',
    wrapRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { scope, collaborator } = request.body

      if (!token || !scope || !collaborator) {
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
      const result = await worker.updateCollaboratorOfScope(
        token as string,
        scope,
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
