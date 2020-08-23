import { Express } from 'express'

import Worker from '../classes/Worker'
import { CollaboratorTypes } from '../types'
import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'updateCollaboratorOfCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/compose/collaborator',
    onRoute(async (request, response) => {
      const { authorization: token } = request.headers
      const { compose, collaborator } = request.body

      const formIsMissing = !token || !compose || !collaborator
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const collaboratorIsInvalid =
        !collaboratorTypesHelpers.validate(collaborator.type) ||
        !collaborator.id
      if (collaboratorIsInvalid) {
        throw new Error('Collaborator is invalid')
      }

      const collaboratorId = collaborator.id

      const item = await worker.updateCollaboratorOfCompose(
        token as string,
        compose,
        { id: collaboratorId, type: collaborator.type as CollaboratorTypes },
      )

      response.json(item)
      return true
    }),
  )
}
