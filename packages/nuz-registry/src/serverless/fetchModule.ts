import { MODULE_LATEST_TAG } from '@nuz/shared'
import { moduleIdHelpers } from '@nuz/utils'
import { Express } from 'express'

import Worker from '../classes/Worker'
import wrapRoute from '../utils/wrapRoute'

import { ServerlessRoute } from './types'

export const name = 'fetchModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/fetch/module',
    wrapRoute(async function (request, response) {
      const { id } = request.query

      if (!id) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      let idEnsured = id as string
      const parsed = moduleIdHelpers.parser(id as string)
      if (!parsed.version || parsed.version === '*') {
        idEnsured = moduleIdHelpers.create(parsed.module, MODULE_LATEST_TAG)
      }

      //
      const result = await worker.fetchModule(idEnsured)

      //
      response.json(result)

      return true
    }),
  )
}
