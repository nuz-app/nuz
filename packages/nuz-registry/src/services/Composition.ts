import { Models } from '../types'

class Composition {
  constructor(private readonly Collection: Models['Composition']) {}
}

export const createService = (collection: Models['Composition']) =>
  new Composition(collection)

export default Composition
