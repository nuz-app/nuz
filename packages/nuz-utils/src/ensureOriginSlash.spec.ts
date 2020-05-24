import * as func from './ensureOriginSlash'
import ensureOriginSlash from './ensureOriginSlash'

describe('ensureOriginSlash', () => {
  it('Exported as default', () => {
    expect(func.default).toBeDefined()
  })

  it('Export as a function', () => {
    expect(ensureOriginSlash).toBeInstanceOf(Function)
  })

  it('Should return undefined', () => {
    expect(ensureOriginSlash('')).toBe(undefined)

  })

  it('Should return a string', async () => {
    expect(ensureOriginSlash('http://nuz.app')).toBe("http://nuz.app/")
  })
})