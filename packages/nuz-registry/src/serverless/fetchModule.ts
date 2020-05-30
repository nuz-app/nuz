import { moduleIdHelpers } from '@nuz/utils'
import { Express } from 'express'

import { LASTEST_TAG } from '../lib/const'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'fetchModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/fetch/module',
    onRoute(async (request, response) => {
      const { id } = request.query

      if (!id) {
        throw new Error('Missing module id to fetch data')
      }

      let idEnsured = id as string
      const parsed = moduleIdHelpers.parser(id as string)
      if (!parsed.version || parsed.version === '*') {
        idEnsured = moduleIdHelpers.create(parsed.module, LASTEST_TAG)
      }

      const item = await worker.fetchModule(idEnsured)
      response.json(item)

      return true
    }),
  )
}
