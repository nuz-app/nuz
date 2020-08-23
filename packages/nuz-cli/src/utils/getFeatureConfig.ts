import { checkIsObject } from '@nuz/utils'
import glob from 'glob'
import path from 'path'

import { CSS_EXTENSIONS, LESS_EXTENSIONS, SASS_EXTENSIONS } from '../lib/const'
import { FeatureConfig, ModuleConfig } from '../types/common'

import * as fs from './fs'

const stylesExtensions = [
  ...CSS_EXTENSIONS,
  ...LESS_EXTENSIONS,
  ...SASS_EXTENSIONS,
]

const useIfOk = <T>(value: T, checker: () => T): T => {
  if (typeof value === 'boolean' || checkIsObject(value)) {
    return value
  }

  return checker()
}
const globSyncInDir = (pattern: string, dir: string) =>
  glob.sync(pattern, { cwd: dir })

const getFeatureConfig = (dir: string, config: ModuleConfig): FeatureConfig => {
  if (config.feature === false) {
    return {
      typescript: false,
      react: false,
      css: false,
      modules: false,
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
    (): boolean => (globSyncInDir('src/**/*{.tsx,.jsx}', dir) || []).length > 0,
  )

  const useCss = useIfOk(
    options.css,
    () =>
      (globSyncInDir(`src/**/*{${stylesExtensions.join(',')}}`, dir) || [])
        .length > 0,
  )
  const useCssModules = useIfOk(options.modules, (): any => 'auto')

  const useLess = useIfOk(
    options.less,
    () => (globSyncInDir('src/**/*.less', dir) || []).length > 0,
  )

  const useSass = useIfOk(
    options.sass,
    () =>
      (globSyncInDir(`src/**/*{${SASS_EXTENSIONS.join(',')}}`, dir) || [])
        .length > 0,
  )

  const usePostCss = useIfOk(
    options.postcss,
    () => (globSyncInDir('postcss.config.js', dir) || []).length > 0,
  )

  return {
    typescript: useTypescript,
    react: useReact,
    css: useCss,
    modules: useCssModules,
    less: useLess,
    sass: useSass,
    postcss: usePostCss,
  }
}

export default getFeatureConfig
