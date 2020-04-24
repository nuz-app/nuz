import { Express } from 'express'

import { CollaboratorTypes } from '../types'

import Worker from '../classes/Worker'
import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'updateCollaboratorOfComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/composition/collaborator',
    onRoute(async (request, response) => {
      const { token, composition, collaborator } = request.body

      const formIsMissing = !token || !composition || !collaborator
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

      const item = await worker.updateCollaboratorOfComposition(
        token,
        composition,
        { id: collaboratorId, type: collaborator.type as CollaboratorTypes },
      )

      response.json(item)
      return true
    }),
  )
}
