import * as commands from './'

describe('commands', () => {
  test('setCommands exported as function', () => {
    expect(commands.setCommands).toBeInstanceOf(Function)
  })
})
