import getPackageJsonInDir from './getPackageJsonInDir'

describe('getPackageJsonInDir', () => {
  it('Export as a function', () => {
    expect(getPackageJsonInDir).toBeInstanceOf(Function)
  })

  describe('Is null', () => {
    it('With have no params', () => {
      // @ts-ignore
      expect(getPackageJsonInDir()).toBe(null)
    })

    it('With an object', () => {
      // @ts-ignore
      expect(getPackageJsonInDir({})).toBe(null)
    })

    it('With a null value', () => {
      // @ts-ignore
      expect(getPackageJsonInDir(null)).toBe(null)
    })

    it('With a number', () => {
      // @ts-ignore
      expect(getPackageJsonInDir(1234)).toBe(null)
    })

    it('With an any wrong string', () => {
      expect(getPackageJsonInDir('nuz')).toBe(null)
    })
  })

  describe('Get package.json success', () => {
    it('With a correct url', () => {
      const x = require('../package.json')
      expect(getPackageJsonInDir('..')).toEqual(x)
    })
  })
})
