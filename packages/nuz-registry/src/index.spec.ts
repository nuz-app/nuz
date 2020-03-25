import { Server } from './'

describe('index', () => {
  test('Server as default is function', () => {
    expect(Server).toBeInstanceOf(Function)
  })
})
