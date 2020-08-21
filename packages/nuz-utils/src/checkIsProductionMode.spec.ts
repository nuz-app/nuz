import * as func from './checkIsProductionMode'

describe('checkIsProductionMode', () => {
  it('Exported as default', () => {
    expect(func.default).toBeDefined()
  })

  it('Export is a function', () => {
    expect(func.default).toBeInstanceOf(Function)
  })

  it('Should return a boolean value', () => {
    expect(typeof func.default()).toBe('boolean')
  })
})
