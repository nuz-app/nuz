import * as func from './deferedPromise'
import deferedPromise from './deferedPromise'

describe('deferedPromise', () => {
  it('Exported as default', () => {
    expect(func.default).toBeDefined()
  })

  it('Should match to snapshot', () => {
    expect(deferedPromise()).toMatchSnapshot()
  })
})
