import { Express } from 'express'

import { CollaboratorTypes } from '../types'

import Worker from '../classes/Worker'
import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import ensureObjectId from '../utils/ensureObjectId'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'updateCollaboratorOfModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/module/collaborator',
    onRoute(async (request, response) => {
      const { authorization: token } = request.headers
      const { module, collaborator } = request.body

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

      const item = await worker.updateCollaboratorOfModule(token as string, module, {
        id: collaborator.id,
        type: collaborator.type as CollaboratorTypes,
      })

      response.json(item)
      return true
    }),
  )
}
