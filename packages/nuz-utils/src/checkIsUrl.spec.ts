import checkIsUrl from './checkIsUrl'

describe('checkIsUrl', () => {
  it('Export as a function', () => {
    expect(checkIsUrl).toBeInstanceOf(Function)
  })

  describe('Is false', () => {
    it('With empty', () => {
      // @ts-ignore
      expect(checkIsUrl(null)).toBe(false)
    })

    it('With empty', () => {
      expect(checkIsUrl('')).toBe(false)
    })

    it('With any str', () => {
      expect(checkIsUrl('abcxyz')).toBe(false)
    })

    it('With a number', () => {
      // @ts-ignore
      expect(checkIsUrl(1234)).toBe(false)
    })

    it('Without Hypertext Transfer Protocol', () => {
      expect(checkIsUrl('abc.xyz')).toBe(false)
    })

    it('With only Hypertext Transfer Protocol', () => {
      expect(checkIsUrl('http://')).toBe(false)
    })
  })

  describe('Is true', () => {
    it('With a http domain', () => {
      expect(checkIsUrl('http://nuz.app')).toBe(true)
    })

    it('With a https domain', () => {
      expect(checkIsUrl('https://nuz.app')).toBe(true)
    })
  })
})
