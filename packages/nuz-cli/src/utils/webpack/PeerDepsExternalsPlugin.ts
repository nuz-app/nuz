import setExternals from './helpers/setExternals'

// tslint:disable-next-line: no-var-requires
const ExternalModuleFactoryPlugin = require('webpack/lib/ExternalModuleFactoryPlugin')

function getPeerDependencies(dir: string | undefined) {
  try {
    const { resolve } = require('path')
    const pkg = require(resolve(dir || process.cwd(), 'package.json'))
    return Object.keys(pkg.peerDependencies).reduce(
      (acc, key) => Object.assign(acc, { [key]: setExternals(key) }),
      {},
    )
  } catch (err) {
    return []
  }
}

class PeerDepsExternalsPlugin {
  constructor(private readonly dir?: string) {}

  apply(compiler: any) {
    const peerDependencies = getPeerDependencies(this.dir)

    // webpack 4+
    if (compiler.hooks) {
      compiler.hooks.compile.tap('compile', (params: any) => {
        new ExternalModuleFactoryPlugin(
          compiler.options.output.libraryTarget,
          peerDependencies,
        ).apply(params.normalModuleFactory)
      })
      // webpack < 4, remove this in next major version
    } else {
      compiler.plugin('compile', (params: any) => {
        params.normalModuleFactory.apply(
          new ExternalModuleFactoryPlugin(
            compiler.options.output.libraryTarget,
            peerDependencies,
          ),
        )
      })
    }
  }
}

export default PeerDepsExternalsPlugin
