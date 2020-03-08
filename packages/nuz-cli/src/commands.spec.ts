import commands from './commands'

describe('commands', () => {
  test('exported as default is list actions', () => {
    expect(Array.isArray(commands)).toEqual(true)
  })
})
