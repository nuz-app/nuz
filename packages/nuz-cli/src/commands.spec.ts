import * as commands from './commands'

describe('commands', () => {
  test('setCommands exported as function', () => {
    expect(commands.setCommands).toBeInstanceOf(Function)
  })
})
