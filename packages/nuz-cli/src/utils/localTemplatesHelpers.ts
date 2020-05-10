import path from 'path'

import * as fs from '../utils/fs'

const LOCAL_TEMPLATES_PATH = path.join(__dirname, '../../../../templates')

export const get = (template: string) =>
  path.join(LOCAL_TEMPLATES_PATH, template)

export const exists = (template: string): boolean => fs.exists(get(template))

export const clone = (template: string, dist: string) =>
  fs.copy(get(template), dist)
