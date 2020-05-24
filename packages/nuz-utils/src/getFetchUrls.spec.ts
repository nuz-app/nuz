import * as func from './getFetchUrls';

describe('compose', () => {
  it('Export as a function', () => {
    expect(func.compose).toBeInstanceOf(Function)
  })

  it('Should return a corresponding string', () => {
    expect(func.compose('1s12s22p6', 'https://nuz-registry.com')).toBe('https://nuz-registry.com/fetch/compose?compose=1s12s22p6')
  })
})

describe('module', () => {
  it('Export as a function', () => {
    expect(func.module).toBeInstanceOf(Function)
  })

  it('Should return a corresponding string', () => {
    expect(func.module('1s12s22p6', 'https://nuz-registry.com')).toBe('https://nuz-registry.com/fetch/module?id=1s12s22p6')
  })
})