import { Express } from 'express'

import { CollaboratorTypes } from '../types'

import Worker from '../classes/Worker'
import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import ensureObjectId from '../utils/ensureObjectId'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'updateCollaboratorOfScope'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/scope/collaborator',
    onRoute(async (request, response) => {
      const { token, scope, collaborator } = request.body

      const formIsMissing = !token || !scope || !collaborator
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const collaboratorIsInvalid =
        !collaboratorTypesHelpers.validate(collaborator.type) ||
        !collaborator.id
      if (collaboratorIsInvalid) {
        throw new Error('Collaborator is invalid')
      }

      const collaboratorId = ensureObjectId(collaborator.id)

      const item = await worker.updateCollaboratorOfScope(token, scope, {
        id: collaboratorId,
        type: collaborator.type as CollaboratorTypes,
      })

      response.json(item)
      return true
    }),
  )
}
