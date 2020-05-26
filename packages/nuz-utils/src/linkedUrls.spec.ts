import * as func from './linkedUrls'

describe('ipv4', () => {
  it('Export as a function', () => {
    expect(func.ipv4).toBeInstanceOf(Function)
  })

  it('Should be localhost', () => {
    expect(func.ipv4()).toBe('localhost')
  })
})

describe('modules', () => {
  it('Export as a function', () => {
    expect(func.modules).toBeInstanceOf(Function)
  })

  it('Should match to new URL', () => {
    expect(func.modules(8080)).toEqual(new URL('http://localhost:8080'))
  })
})

describe('watch', () => {
  it('Export as a function', () => {
    expect(func.watch).toBeInstanceOf(Function)
  })

  it('Should match to new URL', () => {
    expect(func.watch(8080)).toEqual(new URL('http://localhost:8080/watching'))
  })
})
