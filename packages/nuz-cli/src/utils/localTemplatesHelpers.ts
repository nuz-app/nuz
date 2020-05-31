import path from 'path'

import * as fs from '../utils/fs'

const LOCAL_TEMPLATES_PATH = path.join(__dirname, '../../../../templates')

export function get(template: string) {
  return path.join(LOCAL_TEMPLATES_PATH, template)
}

export function exists(template: string): boolean {
  return fs.exists(get(template))
}

export function clone(template: string, dist: string) {
  return fs.copy(get(template), dist)
}
