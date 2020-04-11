import { Models } from '../types'

type CompositionDB = Pick<Models, 'Composition'>

class Composition {
  constructor(private readonly db: CompositionDB) {}
}

export const createService = (db: CompositionDB) => new Composition(db)

export default Composition
