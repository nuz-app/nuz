import { Models } from '../types'

type ModuleDB = Pick<Models, 'Module'>

class Module {
  constructor(private readonly db: ModuleDB) {}
}

export const createService = (db: ModuleDB) => new Module(db)

export default Module
