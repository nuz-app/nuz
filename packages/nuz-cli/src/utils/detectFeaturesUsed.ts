import { checkIsObject } from '@nuz/utils'
import fs from 'fs-extra'
import glob from 'glob'

import { CSS_EXTENSIONS, LESS_EXTENSIONS, SASS_EXTENSIONS } from '../lib/const'
import * as paths from '../paths'
import { FeaturesUsed } from '../types'

import requireInternalConfig from './requireInternalConfig'

const STYLES_EXTENSIONS = [
  ...CSS_EXTENSIONS,
  ...LESS_EXTENSIONS,
  ...SASS_EXTENSIONS,
]

function shouldEnable<T = any>(value: T, detector: () => T): T {
  if (typeof value === 'boolean' || checkIsObject(value)) {
    return value
  }

  return detector()
}

function detectFeaturesUsed(directory: string, dev: boolean): FeaturesUsed {
  const { featuresUsed } = requireInternalConfig({
    directory,
    dev,
    required: true,
  })

  // Turn off all configurations
  if (featuresUsed === false) {
    return {
      typescript: false,
      react: false,
      css: false,
      less: false,
      sass: false,
      postcss: false,
    }
  }

  const used = (featuresUsed || {}) as FeaturesUsed

  // Detect Typescript using by `tsconfig.json` file
  const useTypescript = shouldEnable(used.typescript, (): boolean =>
    fs.existsSync(paths.resolveTsConfigFile(directory)),
  )

  // Detect React using by jsx files in the project
  const useReact = shouldEnable(
    used.react,
    (): boolean =>
      (glob.sync('src/**/*{.tsx,.jsx}', { cwd: directory }) || []).length > 0,
  )

  // Detect css using by styling file in the proiject
  const useCss = shouldEnable(
    used.css,
    (): boolean =>
      (
        glob.sync(`src/**/*{${STYLES_EXTENSIONS.join(',')}}`, {
          cwd: directory,
        }) || []
      ).length > 0,
  )

  // Detect Less using by less files in the project
  const useLess = shouldEnable(
    used.less,
    (): boolean =>
      (
        glob.sync(`src/**/*.{${LESS_EXTENSIONS.join(', ')}}`, {
          cwd: directory,
        }) || []
      ).length > 0,
  )

  // Detect Sass using by less files in the project
  const useSass = shouldEnable(
    used.sass,
    (): boolean =>
      (
        glob.sync(`src/**/*.{${SASS_EXTENSIONS.join(', ')}}`, {
          cwd: directory,
        }) || []
      ).length > 0,
  )

  // Detect PostCSS using by `postcss.config.js` file
  const usePostCss = shouldEnable(used.postcss, () =>
    fs.existsSync(paths.resolveApp(directory, 'postcss.config.js')),
  )

  return {
    typescript: useTypescript,
    react: useReact,
    css: useCss,
    less: useLess,
    sass: useSass,
    postcss: usePostCss,
  }
}

export default detectFeaturesUsed
