import bootstrap from './bootstrap'

describe('bootstrap', () => {
  test('exported as default is function', () => {
    expect(bootstrap).toBeInstanceOf(Function)
  })
})
