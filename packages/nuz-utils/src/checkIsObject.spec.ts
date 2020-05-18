import checkIsObject from './checkIsObject'

it('Export is function', () => {
  expect(checkIsObject).toBeInstanceOf(Function)
})

describe('Is true', () => {
  it('With Object', () => {
    expect(checkIsObject({})).toEqual(true)
  })

  it('With Map', () => {
    // @ts-ignore
    expect(checkIsObject(new Map())).toEqual(true)
  })

  it('With Set', () => {
    // @ts-ignore
    expect(checkIsObject(new Set())).toEqual(true)
  })
})

describe('Is false', () => {
  it('With Null', () => {
    expect(checkIsObject(null)).toEqual(false)
  })

  it('With Undefined', () => {
    // @ts-ignore
    expect(checkIsObject()).toEqual(false)
  })
  it('With String', () => {
    // @ts-ignore
    expect(checkIsObject('')).toEqual(false)
  })

  it('With Array', () => {
    expect(checkIsObject([])).toEqual(false)
  })

  it('With Function', () => {
    // @ts-ignore
    expect(checkIsObject(new Function())).toEqual(false)
  })
})
