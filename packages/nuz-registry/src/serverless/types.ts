import { Express } from 'express'

import Worker from '../classes/Worker'

export type ServerlessRoute = (
  app: Express,
  worker: Worker,
  options: ServerlessConfig,
) => any

export interface ServerlessConfig {
  [key: string]: any
  dev: boolean
}
