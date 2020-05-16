import { Express } from 'express'

import { CollaboratorTypes } from '../types'

import Worker from '../classes/Worker'
import * as collaboratorTypesHelpers from '../utils/collaboratorTypesHelpers'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'addCollaboratorToCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
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

      const item = await worker.addCollaboratorToCompose(
        token as string,
        compose,
        {
          id: collaborator.id,
          type: collaborator.type as CollaboratorTypes,
        },
      )

      response.json(item)
      return true
    }),
  )
}
