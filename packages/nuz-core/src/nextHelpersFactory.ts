import { compareFilesByHash } from '@nuz/utils'
import fs from 'fs'
import path from 'path'

export interface NextHelpersConfig {
  require: NodeRequire
}

const LOADABLE_UPDATED_PATH = path.join(
  __dirname,
  '../bundled/next/loadable.js',
)

const nextHelpersFactory = ({ require }: NextHelpersConfig) => {
  const loadableInApp = require.resolve('next/dist/next-server/lib/loadable')

  const fileIsDiff = !compareFilesByHash(LOADABLE_UPDATED_PATH, loadableInApp)
  if (fileIsDiff) {
    fs.copyFileSync(LOADABLE_UPDATED_PATH, loadableInApp)
  }

  const withNuz = (nextConfig: any = {}) =>
    Object.assign({}, nextConfig, {
      webpack: (webpackConfig: any, { isServer, ...rest }: any) => {
        const webpackCustom = nextConfig.webpack
        const updatedConfig = !webpackCustom
          ? webpackConfig
          : webpackCustom(webpackConfig, { isServer, ...rest })

        if (!isServer) {
          if (!updatedConfig.node) {
            updatedConfig.node = {}
          }
          const useNodeBuiltins = ['child_process', 'fs', 'net']
          useNodeBuiltins.forEach((builtins) => {
            updatedConfig.node[builtins] = !updatedConfig.node[builtins]
              ? 'empty'
              : updatedConfig.node[builtins]
          })
        }

        return updatedConfig
      },
    })

  return { withNuz }
}

export default nextHelpersFactory
