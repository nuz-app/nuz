import * as func from './hashFile'
import hashFile from './hashFile'

describe('hashFile', () => {
  it('Exported as default', () => {
    expect(func.default).toBeDefined()
  })

  it('Should match to the snapshot', () => {
    const path = require.resolve('./hashFile')
    expect(hashFile(path, 'md5')).toMatchSnapshot()
  })
})
