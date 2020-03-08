import { checkIsObject } from '@nuz/utils'
import glob from 'glob'
import path from 'path'

import { FeatureConfig, ModuleConfig } from '../types/common'

import { CSS_EXTENSIONS, LESS_EXTENSIONS, SASS_EXTENSIONS } from '../lib/const'

import * as fs from './fs'

const stylesExtensions = [
  ...CSS_EXTENSIONS,
  ...LESS_EXTENSIONS,
  ...SASS_EXTENSIONS,
]

const useIfOk = (value: boolean | undefined, checker: () => boolean) => {
  if (typeof value === 'boolean' || checkIsObject(value)) {
    return value
  }

  return checker()
}

const getFeatureConfig = (dir: string, config: ModuleConfig): FeatureConfig => {
  if (config.feature === false) {
    return {
      typescript: false,
      react: false,
      css: false,
      less: false,
      sass: false,
      postcss: false,
    }
  }

  const options = (config.feature || {}) as FeatureConfig

  const useTypescript = useIfOk(options.typescript, () =>
    fs.exists(path.join(dir, 'tsconfig.json')),
  )

  const useReact = useIfOk(
    options.react,
    () => (glob.sync(path.join(dir, 'src/**/*{.tsx,.jsx}')) || []).length > 0,
  )

  const useCss = useIfOk(
    options.css,
    () =>
      (
        glob.sync(path.join(dir, `src/**/*{${stylesExtensions.join(',')}}`)) ||
        []
      ).length > 0,
  )

  const useLess = useIfOk(
    options.less,
    () => (glob.sync(path.join(dir, 'src/**/*.less')) || []).length > 0,
  )

  const useSass = useIfOk(
    options.sass,
    () =>
      (
        glob.sync(path.join(dir, `src/**/*{${SASS_EXTENSIONS.join(',')}}`)) ||
        []
      ).length > 0,
  )

  const usePostCss = useIfOk(
    options.postcss,
    () => (glob.sync(path.join(dir, 'postcss.config.js')) || []).length > 0,
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

export default getFeatureConfig
