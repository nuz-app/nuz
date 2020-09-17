import { checkIsObject } from '@nuz/utils'
import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'setModulesForCompose'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.put(
    '/compose/modules',
    wrapRoute(async function (request, response) {
      const { authorization: token } = request.headers
      const { compose, modules: moduleAsObject } = request.body

      if (!token || !compose || !moduleAsObject) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      if (!checkIsObject(moduleAsObject)) {
        throw new Error('Incorrect modules information required.')
      }

      //
      const result = await worker.setModulesForCompose(
        token as string,
        compose,
        moduleAsObject,
      )

      //
      response.json(result)

      return true
    }),
  )
}
