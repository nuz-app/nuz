import { Models } from '../types'

class Module {
  constructor(private readonly Collection: Models['Module']) {}
}

export const createService = (collection: Models['Module']) =>
  new Module(collection)

export default Module
