import fs from 'fs-extra'
import os from 'os'
import rimraf from 'rimraf'

export const realpathSync = fs.realpathSync
export const ensureSymlinkSync = fs.ensureSymlinkSync
export const symlinkSync = fs.symlinkSync
export const symlink = fs.symlink

export const remove = (path: string) => rimraf.sync(path)

export const create = (path: string) => fs.mkdirSync(path)

export const exists = (path: string) => fs.existsSync(path)

export const copy = (src: string, dist: string) => fs.copy(src, dist)
export const copySync = (src: string, dist: string, options?) =>
  fs.copySync(src, dist, options)

export const read = (path: string) => fs.readFileSync(path)
export const readJson = (path: string) => fs.readJson(path)

export const ensureFileSync = (file: string) => fs.ensureFileSync(file)
export const ensureDir = (dir: string) => fs.ensureDir(dir)

export const emptyDir = (dir: string) => fs.emptyDir(dir)

export const writeSync = (path: string, data) => fs.writeFileSync(path, data)
export const writeJson = (path: string, data) =>
  fs.writeJson(path, data, { spaces: 2, EOL: os.EOL })

export const move = (src: string, dist: string) => fs.move(src, dist)
