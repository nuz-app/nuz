import { compareFilesByHash } from '@nuz/utils'
import fs from 'fs'
import path from 'path'

import { worker } from './bootstrap'

export interface NextHelpersConfig {
  require: NodeRequire
  autoInject?: boolean
}

const LOADABLE_UPDATED_PATH = path.join(
  __dirname,
  '../bundled/next/loadable.js',
)

const nextHelpersFactory = ({
  require,
  autoInject = true,
}: NextHelpersConfig) => {
  const loadableInApp = require.resolve('next/dist/next-server/lib/loadable')

  // Replace loadable file of Next.js
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

  const injectNext = () => {
    const nextServerRender = require('next/dist/next-server/server/render')
    const renderToHTML = nextServerRender.renderToHTML.bind(nextServerRender)

    Object.assign(nextServerRender, {
      renderToHTML: async function renderInjected(...rest: any[]) {
        await worker.ready()
        await worker.refresh()

        const html = await renderToHTML(...rest)
        await worker.teardown()

        return html
      },
    })
  }

  if (autoInject) {
    injectNext()
  }

  return { withNuz }
}

export default nextHelpersFactory
