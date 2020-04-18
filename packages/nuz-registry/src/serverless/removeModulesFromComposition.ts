import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeModulesFromComposition'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/composition/modules',
    onRoute(async (request, response) => {
      const { token, composition, moduleIds } = request.body

      const formIsMissing = !token || !composition || !moduleIds
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const moduleIdsIsInvalid =
        !Array.isArray(moduleIds) || moduleIds.length === 0
      if (moduleIdsIsInvalid) {
        throw new Error('Modules is invalid')
      }

      const item = await worker.removeModulesFromComposition(
        token,
        composition,
        moduleIds,
      )

      response.json(item)
      return true
    }),
  )
}
