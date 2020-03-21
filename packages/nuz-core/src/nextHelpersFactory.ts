import { compareFilesByHash } from '@nuz/utils'
import fs from 'fs'
import path from 'path'

const LOADABLE_UPDATED_PATH = path.join(
  __dirname,
  '../bundled/next/loadable.js',
)

const nextHelpersFactory = ({ require }) => {
  const loadableInApp = require.resolve('next/dist/next-server/lib/loadable')

  const fileIsDiff = !compareFilesByHash(LOADABLE_UPDATED_PATH, loadableInApp)
  if (fileIsDiff) {
    fs.copyFileSync(LOADABLE_UPDATED_PATH, loadableInApp)
  }
}

export default nextHelpersFactory
