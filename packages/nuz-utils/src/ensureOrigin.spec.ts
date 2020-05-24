import * as func from './ensureOrigin'
import ensureOrigin from './ensureOrigin'

describe('ensureOrigin', () => {
  it('Exported as default', () => {
    expect(func.default).toBeDefined()
  })

  it('Export as a function', () => {
    expect(ensureOrigin).toBeInstanceOf(Function)
  })

  it('Should return undefined', () => {
    expect(ensureOrigin('')).toBe(undefined)

  })

  it('Should return a string', async () => {
    expect(ensureOrigin('http://nuz.app')).toBe("http://nuz.app")
  })
})