import { compareFilesByHash } from '@nuz/utils'
import fs from 'fs'
import path from 'path'

import * as bootstrap from '../bootstrap'

import { extractorHelpers, inject, Loadable } from './react'

export interface NextFactoryConfig {
  require: NodeRequire
  autoInject?: boolean
}

const LOADABLE_UPDATED_PATH = path.join(
  __dirname,
  '../bundled/next/loadable.js',
)

const LOADABLE_REQUIRE_PATH = 'next/dist/next-server/lib/loadable'

function nextIntegrate(config: NextFactoryConfig) {
  const { require, autoInject = true } = config || {}

  if (!require) {
    throw new Error('`require` is required in config, please provide to use')
  }

  const loadablePath = require.resolve(LOADABLE_REQUIRE_PATH)

  // Replace loadable file of Next.js
  const fileIsDiff = !compareFilesByHash(LOADABLE_UPDATED_PATH, loadablePath)
  if (fileIsDiff) {
    fs.copyFileSync(LOADABLE_UPDATED_PATH, loadablePath)
  }

  function withNuz(nextConfig: any = {}) {
    return Object.assign({}, nextConfig, {
      webpack: (webpackConfig, { isServer, ...rest }) => {
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
  }

  function injectNext() {
    inject({
      react: require('react'),
      'react-dom': require('react-dom'),
    })

    bootstrap.extractor.prepare({
      parser: extractorHelpers.parser,
      renderer: extractorHelpers.renderer,
    })

    const nextServerRender = require('next/dist/next-server/server/render')
    const renderToHTML = nextServerRender.renderToHTML.bind(nextServerRender)
    Object.assign(nextServerRender, {
      renderToHTML: async function injectedRenderToHTML() {
        await Promise.all([
          bootstrap.process.ready(),
          bootstrap.extractor.setup(),
          Loadable.preloadAll(),
        ])

        const html = await renderToHTML.apply(this, arguments)
        const result = bootstrap.extractor.appendTagsToHTML(html)

        await Promise.all([
          bootstrap.process.closeSession(),
          bootstrap.extractor.teardown(),
          bootstrap.process.checkUpdate(() => Loadable.flushAll()),
        ])

        return result
      },
    })

    // const NextLoadable = require(LOADABLE_REQUIRE_PATH)
    // const preloadAll = NextLoadable.default.preloadAll
    // Object.assign(NextLoadable.default, {
    //   preloadAll: async function injectedPreloadAll() {
    //     const [result] = await Promise.all([
    //       await preloadAll.apply(this, arguments),
    //       await Loadable.preloadAll(),
    //     ])
    //     return result
    //   },
    // })
  }

  if (autoInject) {
    injectNext()
  }

  return { withNuz, injectNext }
}

export default nextIntegrate
