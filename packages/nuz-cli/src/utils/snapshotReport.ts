import { pick } from '@nuz/utils'
import fs from 'fs-extra'
import glob from 'glob'

import * as paths from '../paths'

import readPackageJson from './readPackageJson'

function snapshotReport<T = any>(directory: string): T {
  const packageJson = readPackageJson(directory)
  const details = pick(packageJson, [
    'description',
    'homepage',
    'bugs',
    'repository',
    'license',
    'keywords',
  ]) as any

  const match = glob.sync(paths.resolveReadmeFile(directory))
  if (match[0]) {
    details.readme = fs.readFileSync(match[0], { encoding: 'utf8' })
  }

  return details
}

export default snapshotReport
