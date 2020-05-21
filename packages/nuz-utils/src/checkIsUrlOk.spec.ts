import * as func from './checkIsUrlOk'
import checkIsUrlOk from './checkIsUrlOk'

describe('checkIsUrlOk', () => {
  it('Exported as default', () => {
    expect(func.default).toBeDefined()
  })

  it('Export as a function', () => {
    expect(checkIsUrlOk).toBeInstanceOf(Function)
  })

  it('Should return a boolean value', async () => {
    const result = await checkIsUrlOk('fb.com');
    expect(typeof result).toBe("boolean")
  })
})

