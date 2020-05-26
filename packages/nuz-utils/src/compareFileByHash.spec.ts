import * as func from './compareFilesByHash'
import compareFilesByHash from './compareFilesByHash'

describe('compareFilesByHash', () => {
  it('Exported as default', () => {
    expect(func.default).toBeDefined()
  })

  it('Export as a function', () => {
    expect(compareFilesByHash).toBeInstanceOf(Function)
  })

  it('Should return a boolean value', () => {
    const hashFile = jest.fn((a: string, hash: string) => 'abcxyz')
    const fileA = require.resolve('./compareFilesByHash')
    const fileB = require.resolve('./compareFilesByHash')
    expect(typeof compareFilesByHash(fileA, fileB)).toBe('boolean')
  })

  it('Should return a true value', () => {
    const hashFile = jest.fn((a: string, hash: string) => 'abcxyz')
    const fileA = require.resolve('./compareFilesByHash')
    const fileB = require.resolve('./compareFilesByHash')
    expect(compareFilesByHash(fileA, fileB)).toBe(true)
  })

  it('Should return a true value', () => {
    const hashFile = jest.fn((a: string, hash: string) => 'abcxyz')
    const fileA = require.resolve('./compareFilesByHash')
    const fileB = require.resolve('./deferedPromise')
    expect(compareFilesByHash(fileA, fileB)).toBe(false)
  })
})
