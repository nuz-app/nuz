import { Express } from 'express'

import Worker from '../classes/Worker'

export type ServerlessRoute = (
  app: Express,
  worker: Worker,
  options?: any,
) => any
