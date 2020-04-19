import { Express } from 'express'

import { CollaboratorTypes } from '../types'

import Worker from '../classes/Worker'
import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import ensureObjectId from '../utils/ensureObjectId'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'addCollaboratorToModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/module/collaborator',
    onRoute(async (request, response) => {
      const { token, module, collaborator } = request.body

      const formIsMissing = !token || !module || !collaborator
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

      const item = await worker.addCollaboratorToModule(token, module, {
        id: collaboratorId,
        type: collaborator.type as CollaboratorTypes,
      })

      response.json(item)
      return true
    }),
  )
}
