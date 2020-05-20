import checkIsProductionMode from './checkIsProductionMode'

it('Export is a function', () => {
  expect(checkIsProductionMode).toBeInstanceOf(Function)
})
