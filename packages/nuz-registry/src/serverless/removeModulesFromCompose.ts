import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeModulesFromCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/compose/modules',
    onRoute(async (request, response) => {
      const { authorization: token } = request.headers
      const { compose, moduleIds } = request.body

      const formIsMissing = !token || !compose || !moduleIds
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const moduleIdsIsInvalid =
        !Array.isArray(moduleIds) || moduleIds.length === 0
      if (moduleIdsIsInvalid) {
        throw new Error('Modules is invalid')
      }

      const item = await worker.removeModulesFromCompose(
        token as string,
        compose,
        moduleIds,
      )

      response.json(item)
      return true
    }),
  )
}
