import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'removeModulesFromCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.delete(
    '/compose/modules',
    onRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { compose: id, moduleIds } = request.body

      if (!token || !id || !moduleIds) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
        throw new Error('Incorrect modules information required.')
      }

      //
      const result = await worker.removeModulesFromCompose(
        token as string,
        id,
        moduleIds,
      )

      //
      response.json(result)

      return true
    }),
  )
}
