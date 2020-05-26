import * as func from './generateSelfCertificate'
import generateSelfCertificate from './generateSelfCertificate'

describe('generateSelfCertificate', () => {
  it('Exported as default', () => {
    expect(func.default).toBeDefined()
  })

  it('Should match to the snapshot', () => {
    const attributes = { name: 'awesomeNuz', value: 'nuz.app' }

    const result = generateSelfCertificate(attributes)
    expect(generateSelfCertificate(attributes)).toMatchSnapshot({
      cert: expect.any(String),
      fingerprint: expect.any(String),
      private: expect.any(String),
      public: expect.any(String),
    })
  })
})
