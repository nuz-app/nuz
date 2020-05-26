import * as func from './jsonHelpers'

describe('stringify', () => {
  it('Export as a function', () => {
    expect(func.stringify).toBeInstanceOf(Function)
  })

  it('Is JSON.stringify', () => {
    const object = { name: 'awesome nuz' }
    expect(func.stringify(object)).toEqual(JSON.stringify(object))
  })
})

describe('parse', () => {
  it('Export as a function', () => {
    expect(func.parse).toBeInstanceOf(Function)
  })

  it('Is JSON.parse', () => {
    const text = '{"name":"awesome nuz"}'
    expect(func.parse(text)).toEqual(JSON.parse(text))
  })
})
